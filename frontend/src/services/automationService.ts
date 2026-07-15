export type AutomationAction =
  | 'browser.open'
  | 'browser.navigate'
  | 'browser.query'
  | 'browser.click'
  | 'browser.type'
  | 'browser.fill'
  | 'browser.scroll'
  | 'browser.wait'
  | 'browser.read'
  | 'browser.extract'
  | 'files.list'
  | 'files.read'
  | 'files.write';

export interface AutomationIntent {
  action: AutomationAction;
  parameters: Record<string, string>;
  description: string;
}

export interface AutomationResult {
  ok: boolean;
  action: AutomationAction;
  message: string;
  data?: unknown;
  executionId?: string;
}

export interface AutomationLogEntry {
  id: string;
  timestamp: string;
  action: AutomationAction;
  parameters: Record<string, string>;
  ok: boolean;
  message: string;
  durationMs: number;
}

const DEFAULT_BRIDGE_URL = 'http://127.0.0.1:8765';
const BRIDGE_URL_KEY = 'hatclaw.automation.bridgeUrl';
const BRIDGE_TOKEN_KEY = 'hatclaw.automation.token';

const normalizeUrl = (value?: string) => {
  if (!value) return 'https://www.google.com';
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

export function parseAutomationIntent(text: string): AutomationIntent | null {
  const trimmed = text.trim();
  let match = trimmed.match(/^(?:por favor[,]?\s*)?(?:abra|abrir|inicie|iniciar|open)\s+(?:o\s+)?(?:google\s+)?chrome(?:\s+(?:em|no|na|para)?\s*(\S+))?\s*[.!]?$/i);
  if (match) {
    const url = normalizeUrl(match[1]?.replace(/[.!]$/, ''));
    return { action: 'browser.open', parameters: { url }, description: `Abrir o Chrome em ${url}` };
  }

  match = trimmed.match(/^(?:no\s+chrome[,]?\s*)?(?:acesse|navegue|abra)\s+(https?:\/\/\S+|\S+\.\S+)\s*[.!]?$/i);
  if (match) {
    const url = normalizeUrl(match[1].replace(/[.!]$/, ''));
    return { action: 'browser.navigate', parameters: { url }, description: `Navegar para ${url}` };
  }

  match = trimmed.match(/^(?:no\s+chrome[,]?\s*)?(?:clique|click)\s+(?:no\s+elemento\s+)?(?:seletor\s+)?["'`](.+?)["'`]\s*[.!]?$/i);
  if (match) {
    return { action: 'browser.click', parameters: { selector: match[1] }, description: `Clicar no elemento ${match[1]}` };
  }

  match = trimmed.match(/^(?:no\s+chrome[,]?\s*)?(?:encontre|localize|consulte|query)\s+(?:os\s+)?(?:elementos?\s+)?(?:com\s+)?(?:seletor\s+)?["'`](.+?)["'`]\s*[.!]?$/i);
  if (match) {
    return { action: 'browser.query', parameters: { selector: match[1] }, description: `Consultar elementos ${match[1]}` };
  }

  match = trimmed.match(/^(?:no\s+chrome[,]?\s*)?(?:digite|type)\s+["'`](.+?)["'`]\s+(?:no|em)\s+(?:elemento\s+|seletor\s+)?["'`](.+?)["'`]\s*[.!]?$/i);
  if (match) {
    return { action: 'browser.type', parameters: { text: match[1], selector: match[2] }, description: `Digitar no elemento ${match[2]}` };
  }

  match = trimmed.match(/^(?:no\s+chrome[,]?\s*)?(?:preencha|preencher|fill)\s+(?:o\s+)?(?:campo\s+|elemento\s+|seletor\s+)?["'`](.+?)["'`]\s+(?:com|usando)\s+["'`]([\s\S]+?)["'`]\s*[.!]?$/i);
  if (match) {
    return { action: 'browser.fill', parameters: { selector: match[1], text: match[2] }, description: `Preencher o elemento ${match[1]}` };
  }

  match = trimmed.match(/^(?:no\s+chrome[,]?\s*)?(?:role|rolar|scroll)(?:\s+(?:at[eé]|para)\s+(?:o\s+)?(?:elemento\s+|seletor\s+)?["'`](.+?)["'`]|\s+(-?\d+))\s*[.!]?$/i);
  if (match) {
    const parameters: Record<string, string> = match[1] ? { selector: match[1] } : { y: match[2] };
    return { action: 'browser.scroll', parameters, description: match[1] ? `Rolar até ${match[1]}` : `Rolar ${match[2]} pixels` };
  }

  match = trimmed.match(/^(?:no\s+chrome[,]?\s*)?(?:aguarde|esperar|wait)\s+(?:pelo\s+|o\s+)?(?:elemento\s+|seletor\s+)?["'`](.+?)["'`](?:\s+(?:por\s+)?(\d+)\s*(?:segundos?|s))?\s*[.!]?$/i);
  if (match) {
    return {
      action: 'browser.wait',
      parameters: { selector: match[1], ...(match[2] ? { timeout: match[2] } : {}) },
      description: `Aguardar o elemento ${match[1]}`,
    };
  }

  match = trimmed.match(/^(?:leia|ler|read)\s+(?:o\s+)?(?:elemento|conte[uú]do)\s+["'`](.+?)["'`]\s*[.!]?$/i);
  if (match) {
    return { action: 'browser.read', parameters: { selector: match[1] }, description: `Ler o elemento ${match[1]}` };
  }

  match = trimmed.match(/^(?:no\s+chrome[,]?\s*)?(?:extraia|extrair|extract)\s+(?:o\s+)?(?:conte[uú]do\s+)?(?:do\s+)?(?:elemento\s+|seletor\s+)?["'`](.+?)["'`](?:\s+como\s+(texto|html|valor|href))?\s*[.!]?$/i);
  if (match) {
    const mode = ({ texto: 'text', valor: 'value' } as Record<string, string>)[match[2]?.toLowerCase()] || match[2]?.toLowerCase() || 'text';
    return { action: 'browser.extract', parameters: { selector: match[1], mode }, description: `Extrair conteúdo de ${match[1]}` };
  }

  match = trimmed.match(/^(?:liste|listar|list)\s+(?:os\s+)?arquivos(?:\s+(?:em|da pasta)\s+["'`](.+?)["'`])?\s*[.!]?$/i);
  if (match) {
    return { action: 'files.list', parameters: { path: match[1] || '.' }, description: `Listar arquivos em ${match[1] || '.'}` };
  }

  match = trimmed.match(/^(?:leia|ler|read)\s+(?:o\s+)?arquivo\s+["'`](.+?)["'`]\s*[.!]?$/i);
  if (match) {
    return { action: 'files.read', parameters: { path: match[1] }, description: `Ler o arquivo ${match[1]}` };
  }

  match = trimmed.match(/^(?:crie|criar|grave|escreva|write)\s+(?:o\s+)?arquivo\s+["'`](.+?)["'`]\s+(?:com|contendo)\s+["'`]([\s\S]+)["'`]\s*[.!]?$/i);
  if (match) {
    return { action: 'files.write', parameters: { path: match[1], content: match[2] }, description: `Gravar o arquivo ${match[1]}` };
  }

  return null;
}

export const getAutomationBridgeUrl = () => localStorage.getItem(BRIDGE_URL_KEY) || DEFAULT_BRIDGE_URL;
export const setAutomationBridgeUrl = (value: string) => localStorage.setItem(BRIDGE_URL_KEY, value.replace(/\/$/, ''));
export const getAutomationToken = () => localStorage.getItem(BRIDGE_TOKEN_KEY) || '';
export const setAutomationToken = (value: string) => localStorage.setItem(BRIDGE_TOKEN_KEY, value);

const request = async (path: string, init?: RequestInit, timeoutMs = 70_000) => {
  const token = getAutomationToken();
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${getAutomationBridgeUrl()}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'X-HatClaw-Token': token } : {}),
        ...init?.headers,
      },
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('A automação excedeu o tempo limite.', { cause: error });
    }
    throw error;
  } finally {
    window.clearTimeout(timer);
  }
};

export async function checkAutomationBridge(): Promise<{ ok: boolean; platform?: string; root?: string }> {
  const response = await request('/health');
  if (!response.ok) throw new Error(`Ponte local indisponível (HTTP ${response.status})`);
  return response.json();
}

export async function getAutomationLogs(limit = 20): Promise<AutomationLogEntry[]> {
  const response = await request(`/v1/logs?limit=${Math.min(200, Math.max(1, limit))}`, undefined, 10_000);
  const result = await response.json().catch(() => null);
  if (!response.ok) throw new Error(result?.message || `Falha ao carregar registros (HTTP ${response.status})`);
  return result?.entries || [];
}

export async function executeAutomation(intent: AutomationIntent): Promise<AutomationResult> {
  const response = await request('/v1/actions', {
    method: 'POST',
    body: JSON.stringify({ action: intent.action, parameters: intent.parameters, confirmed: true }),
  });
  const result = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(result?.message || `Falha na automação local (HTTP ${response.status})`);
  }
  return result;
}
