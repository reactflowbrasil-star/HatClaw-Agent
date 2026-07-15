# Automação local HatClaw

O aplicativo web conversa com uma ponte local que controla o Chrome por DOM e manipula somente arquivos dentro de uma pasta autorizada. A ponte escuta exclusivamente em `127.0.0.1` e cada ação exige confirmação no navegador.

## Windows

```powershell
.\automation\start-bridge.ps1
```

### Motor agent-browser

Instale uma vez o motor nativo `agent-browser`:

```powershell
.\automation\install-agent-browser.ps1
```

Quando disponível, o bridge usa `agent-browser` como motor preferencial e mantém Selenium como fallback. A janela do Chrome é visível por padrão. Use `AGENT_BROWSER_HEADED=false` para execução headless ou `AUTOMATION_BROWSER_ENGINE=selenium` para forçar o motor anterior.

Por padrão, os arquivos ficam em `Documents\HatClawAutomation`. Variáveis opcionais:

```powershell
$env:AUTOMATION_ROOT = 'C:\MinhaPastaAutorizada'
$env:AUTOMATION_BRIDGE_TOKEN = 'um-token-local'
$env:AUTOMATION_TIMEOUT = '15'
.\automation\start-bridge.ps1
```

## Android

Conecte o aparelho por ADB, instale e inicie um servidor Appium com o driver UiAutomator2 e execute:

```powershell
$env:AUTOMATION_DEVICE = 'android'
.\automation\start-bridge.ps1
```

Abrir o Chrome usa ADB. Consulta e interação com o DOM usam Appium/Selenium.

## Recursos DOM

A ponte aceita seletores CSS e XPath. XPath é detectado automaticamente quando o seletor
começa com `/` ou `(`; também pode ser indicado com `selectorType: "xpath"`. As ações
aguardam o DOM por padrão por 15 segundos (máximo de 60), repetem operações afetadas por
elementos obsoletos e retornam erros legíveis quando a condição não é atendida.

- `browser.query`: identifica até 100 elementos e seus atributos principais.
- `browser.click`: aguarda o elemento ficar clicável e clica.
- `browser.fill` / `browser.type`: aguarda, limpa e preenche um campo.
- `browser.scroll`: rola por coordenadas ou até um elemento.
- `browser.wait`: aguarda `present`, `visible`, `clickable` ou `absent`.
- `browser.extract` / `browser.read`: extrai texto, HTML, valor ou href.
- `browser.snapshot`: produz o mapa acessível da página com referências do agent-browser.
- `browser.screenshot`: salva uma captura dentro da pasta autorizada.
- `browser.hover` / `browser.press`: move o mouse e envia teclas.
- `browser.back` / `browser.forward` / `browser.reload`: controla o histórico da página.
- `browser.close`: encerra a sessão automatizada.
- `GET /v1/logs?limit=20`: retorna o registro das últimas execuções; textos preenchidos são ocultados.

## Exemplos no chat

- `abra o chrome`
- `abrir chrome example.com`
- `clique no elemento "#entrar"`
- `clique no elemento "//button[@type='submit']"`
- `encontre elementos "a[href]"`
- `digite "Olá" no elemento "#mensagem"`
- `preencha o campo "#email" com "nome@exemplo.com"`
- `role até o elemento "#rodape"`
- `aguarde o elemento ".resultado" por 15 segundos`
- `leia o elemento "main"`
- `extraia o conteúdo do elemento "main" como html`
- `liste arquivos`
- `leia o arquivo "notas.txt"`
- `crie o arquivo "notas.txt" com "conteúdo"`
- `inspecione a página`
- `tire um screenshot`
- `passe o mouse sobre "#menu"`
- `pressione a tecla "Enter"`
- `recarregue a página`
- `feche o chrome`

Não existe endpoint para shell arbitrário. URLs aceitam apenas HTTP/HTTPS e caminhos não podem sair da pasta autorizada.
