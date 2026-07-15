import { describe, expect, it } from 'vitest';
import { parseAutomationIntent } from '../automationService';

describe('parseAutomationIntent', () => {
  it('recognizes opening Chrome', () => {
    expect(parseAutomationIntent('abra o chrome')?.action).toBe('browser.open');
  });

  it('normalizes a Chrome URL', () => {
    expect(parseAutomationIntent('abrir chrome example.com')?.parameters.url).toBe('https://example.com');
  });

  it('recognizes DOM click and typing', () => {
    expect(parseAutomationIntent('clique no elemento "#entrar"')?.action).toBe('browser.click');
    expect(parseAutomationIntent('digite "Olá" no elemento "#mensagem"')?.parameters).toEqual({
      text: 'Olá', selector: '#mensagem',
    });
  });

  it('recognizes CSS and XPath queries', () => {
    expect(parseAutomationIntent('encontre elementos "button.primary"')?.parameters.selector).toBe('button.primary');
    expect(parseAutomationIntent('clique no elemento "//button[@type=\'submit\']"')?.parameters.selector).toBe("//button[@type='submit']");
  });

  it('recognizes fill, scroll, wait and extraction', () => {
    expect(parseAutomationIntent('preencha o campo "#email" com "a@b.com"')?.action).toBe('browser.fill');
    expect(parseAutomationIntent('role até o elemento "#rodape"')?.action).toBe('browser.scroll');
    expect(parseAutomationIntent('aguarde o elemento ".resultado" por 15 segundos')?.parameters.timeout).toBe('15');
    expect(parseAutomationIntent('extraia o conteúdo do elemento "main" como html')?.parameters.mode).toBe('html');
  });

  it('recognizes agent-browser controls', () => {
    expect(parseAutomationIntent('inspecione a página')?.action).toBe('browser.snapshot');
    expect(parseAutomationIntent('tire um screenshot')?.action).toBe('browser.screenshot');
    expect(parseAutomationIntent('passe o mouse sobre "#menu"')?.action).toBe('browser.hover');
    expect(parseAutomationIntent('pressione a tecla "Enter"')?.parameters.key).toBe('Enter');
    expect(parseAutomationIntent('volte uma página')?.action).toBe('browser.back');
    expect(parseAutomationIntent('recarregue a página')?.action).toBe('browser.reload');
    expect(parseAutomationIntent('feche o chrome')?.action).toBe('browser.close');
  });

  it('recognizes sandboxed file actions', () => {
    expect(parseAutomationIntent('liste arquivos')?.action).toBe('files.list');
    expect(parseAutomationIntent('leia o arquivo "notas.txt"')?.action).toBe('files.read');
    expect(parseAutomationIntent('crie o arquivo "notas.txt" com "conteúdo"')?.action).toBe('files.write');
  });

  it('ignores ordinary chat', () => {
    expect(parseAutomationIntent('explique como funciona o Chrome')).toBeNull();
  });
});
