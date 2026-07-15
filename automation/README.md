# Automação local HatClaw

O aplicativo web conversa com uma ponte local que controla o Chrome por DOM e manipula somente arquivos dentro de uma pasta autorizada. A ponte escuta exclusivamente em `127.0.0.1` e cada ação exige confirmação no navegador.

## Windows

```powershell
.\automation\start-bridge.ps1
```

Por padrão, os arquivos ficam em `Documents\HatClawAutomation`. Variáveis opcionais:

```powershell
$env:AUTOMATION_ROOT = 'C:\MinhaPastaAutorizada'
$env:AUTOMATION_BRIDGE_TOKEN = 'um-token-local'
.\automation\start-bridge.ps1
```

## Android

Conecte o aparelho por ADB, instale e inicie um servidor Appium com o driver UiAutomator2 e execute:

```powershell
$env:AUTOMATION_DEVICE = 'android'
.\automation\start-bridge.ps1
```

Abrir o Chrome usa ADB. Clique, digitação e leitura do DOM usam Appium/Selenium.

## Exemplos no chat

- `abra o chrome`
- `abrir chrome example.com`
- `clique no elemento "#entrar"`
- `digite "Olá" no elemento "#mensagem"`
- `leia o elemento "main"`
- `liste arquivos`
- `leia o arquivo "notas.txt"`
- `crie o arquivo "notas.txt" com "conteúdo"`

Não existe endpoint para shell arbitrário. URLs aceitam apenas HTTP/HTTPS e caminhos não podem sair da pasta autorizada.
