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

  it('recognizes sandboxed file actions', () => {
    expect(parseAutomationIntent('liste arquivos')?.action).toBe('files.list');
    expect(parseAutomationIntent('leia o arquivo "notas.txt"')?.action).toBe('files.read');
    expect(parseAutomationIntent('crie o arquivo "notas.txt" com "conteúdo"')?.action).toBe('files.write');
  });

  it('ignores ordinary chat', () => {
    expect(parseAutomationIntent('explique como funciona o Chrome')).toBeNull();
  });
});
