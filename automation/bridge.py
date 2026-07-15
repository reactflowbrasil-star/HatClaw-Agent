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
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

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
_browser_lock = threading.Lock()
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

    if action in {"browser.click", "browser.type", "browser.read"}:
        from selenium.webdriver.common.by import By
        selector = str(params.get("selector", "")).strip()
        if not selector or len(selector) > 500:
            raise ValueError("Seletor CSS inválido.")
        element = dom_driver().find_element(By.CSS_SELECTOR, selector)
        if action == "browser.click":
            element.click()
            return f"Clique executado em {selector}.", None
        if action == "browser.type":
            text = str(params.get("text", ""))
            if len(text) > 50_000:
                raise ValueError("O texto excede 50.000 caracteres.")
            element.clear()
            element.send_keys(text)
            return f"Texto digitado em {selector}.", None
        value = element.text or element.get_attribute("value") or ""
        return f"Conteúdo lido de {selector}.", {"text": value[:50_000]}

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
        if self.path != "/health" or not self.authorized():
            self.reply(404 if self.path != "/health" else 403, {"ok": False, "message": "Indisponível."})
            return
        self.reply(200, {"ok": True, "platform": platform.system(), "device": DEVICE, "root": str(ROOT)})

    def do_POST(self):
        if self.path != "/v1/actions" or not self.authorized():
            self.reply(404 if self.path != "/v1/actions" else 403, {"ok": False, "message": "Indisponível."})
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0 or length > MAX_BODY:
                raise ValueError("Requisição vazia ou maior que 1 MB.")
            body = json.loads(self.rfile.read(length))
            if body.get("confirmed") is not True:
                raise PermissionError("A confirmação do usuário é obrigatória.")
            action = str(body.get("action", ""))
            if action not in {"browser.open", "browser.navigate", "browser.click", "browser.type", "browser.read", "files.list", "files.read", "files.write"}:
                raise ValueError("Ação não permitida.")
            message, data = execute(action, body.get("parameters") or {})
            self.reply(200, {"ok": True, "action": action, "message": message, "data": data})
        except PermissionError as exc:
            self.reply(403, {"ok": False, "message": str(exc)})
        except (ValueError, OSError, RuntimeError, subprocess.SubprocessError) as exc:
            self.reply(400, {"ok": False, "message": str(exc)})
        except Exception as exc:
            self.reply(500, {"ok": False, "message": f"Falha na automação: {exc}"})


if __name__ == "__main__":
    ROOT.mkdir(parents=True, exist_ok=True)
    print(f"HatClaw Automation Bridge: http://{HOST}:{PORT}")
    print(f"Pasta autorizada: {ROOT}")
    ThreadingHTTPServer((HOST, PORT), Handler).serve_forever()
