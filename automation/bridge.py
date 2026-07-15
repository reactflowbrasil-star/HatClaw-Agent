"""HatClaw local automation bridge.

Runs only on loopback and exposes a small allowlisted API for browser DOM and
sandboxed file operations. It deliberately does not expose arbitrary shell.
"""
from __future__ import annotations

import json
import os
import platform
import shutil
import subprocess
import sys
import threading
import time
import uuid
import webbrowser
from collections import deque
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

HOST = "127.0.0.1"
PORT = int(os.getenv("AUTOMATION_PORT", "8765"))
MAX_BODY = 1_048_576
ROOT = Path(os.getenv("AUTOMATION_ROOT", str(Path.home() / "Documents" / "HatClawAutomation"))).expanduser().resolve()
TOKEN = os.getenv("AUTOMATION_BRIDGE_TOKEN", "")
DEFAULT_ORIGINS = (
    "https://ca-web-aul4uukqnburs.bravehill-5aa61ebc.eastus2.azurecontainerapps.io,"
    "http://localhost:8080,http://localhost:5173"
)
ALLOWED_ORIGINS = {item.strip().rstrip("/") for item in os.getenv("AUTOMATION_ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",") if item.strip()}
DEVICE = os.getenv("AUTOMATION_DEVICE", "desktop").lower()
DEFAULT_TIMEOUT = float(os.getenv("AUTOMATION_TIMEOUT", "15"))
MAX_TIMEOUT = 60.0
MAX_LOG_ENTRIES = 200
ALLOWED_ACTIONS = {
    "browser.open", "browser.navigate", "browser.query", "browser.click",
    "browser.type", "browser.fill", "browser.scroll", "browser.wait",
    "browser.read", "browser.extract", "files.list", "files.read", "files.write",
}
_browser_lock = threading.Lock()
_log_lock = threading.Lock()
_execution_log: deque[dict] = deque(maxlen=MAX_LOG_ENTRIES)
_driver = None


def safe_path(value: str | None) -> Path:
    candidate = (ROOT / (value or ".")).resolve()
    if candidate != ROOT and ROOT not in candidate.parents:
        raise ValueError("O caminho deve permanecer dentro da pasta autorizada.")
    return candidate


def valid_url(value: str) -> str:
    parsed = urlparse(value)
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("A URL deve usar http ou https.")
    return value


def adb_open(url: str) -> None:
    adb = shutil.which("adb")
    if not adb:
        raise RuntimeError("ADB não encontrado. Instale Android platform-tools.")
    subprocess.run([adb, "shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", url, "com.android.chrome"], check=True, timeout=20)


def selenium_driver():
    global _driver
    with _browser_lock:
        if _driver is None:
            try:
                from selenium import webdriver
                options = webdriver.ChromeOptions()
                options.add_experimental_option("detach", True)
                _driver = webdriver.Chrome(options=options)
            except ImportError as exc:
                raise RuntimeError("Selenium não instalado. Execute automation/start-bridge.ps1.") from exc
        return _driver


def appium_driver():
    global _driver
    with _browser_lock:
        if _driver is None:
            try:
                from appium import webdriver
                from appium.options.android import UiAutomator2Options
                options = UiAutomator2Options().load_capabilities({
                    "platformName": "Android", "automationName": "UiAutomator2",
                    "browserName": "Chrome", "noReset": True,
                })
                _driver = webdriver.Remote(os.getenv("APPIUM_SERVER_URL", "http://127.0.0.1:4723"), options=options)
            except ImportError as exc:
                raise RuntimeError("Appium não instalado. Use: pip install Appium-Python-Client") from exc
        return _driver


def dom_driver():
    return appium_driver() if DEVICE == "android" else selenium_driver()


def action_timeout(params: dict) -> float:
    try:
        timeout = float(params.get("timeout", DEFAULT_TIMEOUT))
    except (TypeError, ValueError) as exc:
        raise ValueError("Timeout inválido.") from exc
    if timeout <= 0 or timeout > MAX_TIMEOUT:
        raise ValueError(f"O timeout deve estar entre 0 e {int(MAX_TIMEOUT)} segundos.")
    return timeout


def selector_locator(params: dict):
    from selenium.webdriver.common.by import By

    selector = str(params.get("selector", "")).strip()
    if not selector or len(selector) > 500:
        raise ValueError("Seletor CSS ou XPath inválido.")
    selector_type = str(params.get("selectorType", "auto")).lower()
    if selector_type not in {"auto", "css", "xpath"}:
        raise ValueError("selectorType deve ser auto, css ou xpath.")
    if selector_type == "xpath" or (selector_type == "auto" and selector.startswith(("/", "("))):
        return (By.XPATH, selector)
    return (By.CSS_SELECTOR, selector)


def wait_for(params: dict, condition: str = "present"):
    from selenium.common.exceptions import TimeoutException
    from selenium.webdriver.support import expected_conditions as ec
    from selenium.webdriver.support.ui import WebDriverWait

    driver = dom_driver()
    locator = selector_locator(params)
    conditions = {
        "present": ec.presence_of_element_located(locator),
        "visible": ec.visibility_of_element_located(locator),
        "clickable": ec.element_to_be_clickable(locator),
        "absent": ec.invisibility_of_element_located(locator),
    }
    if condition not in conditions:
        raise ValueError("Condição deve ser present, visible, clickable ou absent.")
    try:
        return WebDriverWait(driver, action_timeout(params), poll_frequency=0.2).until(conditions[condition])
    except TimeoutException as exc:
        raise RuntimeError(f"Elemento não atingiu a condição '{condition}' dentro do timeout.") from exc


def element_action(params: dict, operation, condition: str = "visible"):
    from selenium.common.exceptions import StaleElementReferenceException

    last_error = None
    for _ in range(3):
        try:
            return operation(wait_for(params, condition))
        except StaleElementReferenceException as exc:
            last_error = exc
    raise RuntimeError("O DOM mudou durante a ação; o elemento permaneceu instável.") from last_error


def element_snapshot(element: object) -> dict:
    attributes = {}
    for name in ("id", "name", "type", "role", "href", "value", "aria-label", "placeholder"):
        value = element.get_attribute(name)
        if value:
            attributes[name] = value[:2_000]
    return {
        "tag": element.tag_name,
        "text": (element.text or "")[:10_000],
        "attributes": attributes,
        "displayed": element.is_displayed(),
        "enabled": element.is_enabled(),
    }


def safe_log_parameters(params: dict) -> dict:
    safe = {}
    for key, value in params.items():
        if key.lower() in {"text", "content", "token"}:
            safe[key] = f"<redacted:{len(str(value))} chars>"
        else:
            safe[key] = str(value)[:1_000]
    return safe


def record_execution(execution_id: str, action: str, params: dict, started: float, ok: bool, message: str) -> None:
    entry = {
        "id": execution_id,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "action": action,
        "parameters": safe_log_parameters(params),
        "ok": ok,
        "message": message[:2_000],
        "durationMs": round((time.monotonic() - started) * 1_000),
    }
    with _log_lock:
        _execution_log.append(entry)


def execute(action: str, params: dict) -> tuple[str, object | None]:
    if action in {"browser.open", "browser.navigate"}:
        url = valid_url(str(params.get("url", "https://www.google.com")))
        if DEVICE == "android" and action == "browser.open":
            adb_open(url)
        else:
            try:
                driver = dom_driver()
                driver.get(url)
            except RuntimeError:
                if action != "browser.open" or DEVICE == "android":
                    raise
                webbrowser.open(url, new=1)
        return f"Chrome aberto em {url}.", {"url": url}

    if action == "browser.query":
        driver = dom_driver()
        wait_for(params, "present")
        elements = driver.find_elements(*selector_locator(params))[:100]
        return f"{len(elements)} elemento(s) encontrado(s).", {"elements": [element_snapshot(item) for item in elements]}

    if action in {"browser.click", "browser.type", "browser.fill", "browser.read", "browser.extract"}:
        selector = str(params.get("selector", "")).strip()
        if action == "browser.click":
            element_action(params, lambda element: element.click(), "clickable")
            return f"Clique executado em {selector}.", None
        if action in {"browser.type", "browser.fill"}:
            text = str(params.get("text", ""))
            if len(text) > 50_000:
                raise ValueError("O texto excede 50.000 caracteres.")
            def fill(element):
                element.clear()
                element.send_keys(text)
            element_action(params, fill)
            return f"Campo preenchido em {selector}.", None

        mode = "text" if action == "browser.read" else str(params.get("mode", "text")).lower()
        if mode not in {"text", "html", "value", "href"}:
            raise ValueError("Modo de extração deve ser text, html, value ou href.")
        def extract(element):
            if mode == "html":
                return element.get_attribute("outerHTML") or ""
            if mode in {"value", "href"}:
                return element.get_attribute(mode) or ""
            return element.text or element.get_attribute("value") or ""
        value = element_action(params, extract)
        return f"Conteúdo extraído de {selector}.", {"mode": mode, "content": value[:50_000]}

    if action == "browser.scroll":
        driver = dom_driver()
        selector = str(params.get("selector", "")).strip()
        if selector:
            element = wait_for(params, "present")
            driver.execute_script("arguments[0].scrollIntoView({behavior:'smooth',block:'center'});", element)
            return f"Rolagem executada até {selector}.", None
        try:
            x, y = int(params.get("x", 0)), int(params.get("y", 500))
        except (TypeError, ValueError) as exc:
            raise ValueError("Coordenadas de rolagem inválidas.") from exc
        driver.execute_script("window.scrollBy(arguments[0], arguments[1]);", x, y)
        return f"Rolagem executada em ({x}, {y}).", None

    if action == "browser.wait":
        condition = str(params.get("condition", "present")).lower()
        wait_for(params, condition)
        return f"Condição '{condition}' atendida para {params.get('selector')}.", {"condition": condition}

    path = safe_path(str(params.get("path", ".")))
    if action == "files.list":
        if not path.is_dir():
            raise ValueError("A pasta não existe.")
        entries = [{"name": p.name, "type": "directory" if p.is_dir() else "file", "size": p.stat().st_size if p.is_file() else None} for p in sorted(path.iterdir())[:200]]
        return f"{len(entries)} item(ns) encontrado(s).", {"path": str(path.relative_to(ROOT)), "entries": entries}
    if action == "files.read":
        if not path.is_file() or path.stat().st_size > MAX_BODY:
            raise ValueError("Arquivo inexistente ou maior que 1 MB.")
        return f"Arquivo {path.name} lido.", {"path": str(path.relative_to(ROOT)), "content": path.read_text(encoding="utf-8")}
    if action == "files.write":
        content = str(params.get("content", ""))
        if len(content.encode("utf-8")) > MAX_BODY:
            raise ValueError("Conteúdo maior que 1 MB.")
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content, encoding="utf-8")
        return f"Arquivo {path.name} gravado na pasta autorizada.", {"path": str(path.relative_to(ROOT)), "bytes": len(content.encode("utf-8"))}
    raise ValueError("Ação não permitida.")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        sys.stdout.write("[HatClaw] " + fmt % args + "\n")

    def cors(self):
        origin = self.headers.get("Origin", "").rstrip("/")
        if origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-HatClaw-Token")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

    def reply(self, status: int, body: dict):
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.cors()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def authorized(self):
        origin = self.headers.get("Origin", "").rstrip("/")
        return (not origin or origin in ALLOWED_ORIGINS) and (not TOKEN or self.headers.get("X-HatClaw-Token") == TOKEN)

    def do_OPTIONS(self):
        if not self.authorized():
            self.reply(403, {"ok": False, "message": "Origem ou token não autorizado."})
            return
        self.send_response(204)
        self.cors()
        self.end_headers()

    def do_GET(self):
        request_url = urlparse(self.path)
        if request_url.path not in {"/health", "/v1/logs"} or not self.authorized():
            self.reply(404 if request_url.path not in {"/health", "/v1/logs"} else 403, {"ok": False, "message": "Indisponível."})
            return
        if request_url.path == "/health":
            self.reply(200, {"ok": True, "platform": platform.system(), "device": DEVICE, "root": str(ROOT)})
            return
        try:
            limit = min(200, max(1, int(parse_qs(request_url.query).get("limit", [50])[0])))
        except ValueError:
            limit = 50
        with _log_lock:
            entries = list(_execution_log)[-limit:]
        self.reply(200, {"ok": True, "entries": entries})

    def do_POST(self):
        if self.path != "/v1/actions" or not self.authorized():
            self.reply(404 if self.path != "/v1/actions" else 403, {"ok": False, "message": "Indisponível."})
            return
        execution_id = str(uuid.uuid4())
        started = time.monotonic()
        action = "unknown"
        params = {}
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > MAX_BODY:
                raise ValueError("Requisição vazia ou maior que 1 MB.")
            body = json.loads(self.rfile.read(length))
            if body.get("confirmed") is not True:
                raise PermissionError("A confirmação do usuário é obrigatória.")
            action = str(body.get("action", ""))
            params = body.get("parameters") or {}
            if not isinstance(params, dict):
                raise ValueError("Parâmetros inválidos.")
            if action not in ALLOWED_ACTIONS:
                raise ValueError("Ação não permitida.")
            message, data = execute(action, params)
            record_execution(execution_id, action, params, started, True, message)
            self.reply(200, {"ok": True, "action": action, "message": message, "data": data, "executionId": execution_id})
        except PermissionError as exc:
            record_execution(execution_id, action, params, started, False, str(exc))
            self.reply(403, {"ok": False, "message": str(exc)})
        except (ValueError, OSError, RuntimeError, subprocess.SubprocessError) as exc:
            record_execution(execution_id, action, params, started, False, str(exc))
            self.reply(400, {"ok": False, "message": str(exc)})
        except Exception as exc:
            record_execution(execution_id, action, params, started, False, str(exc))
            self.reply(500, {"ok": False, "message": f"Falha na automação: {exc}"})


if __name__ == "__main__":
    ROOT.mkdir(parents=True, exist_ok=True)
    print(f"HatClaw Automation Bridge: http://{HOST}:{PORT}")
    print(f"Pasta autorizada: {ROOT}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
