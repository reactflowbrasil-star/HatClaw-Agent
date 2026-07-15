import { useState, useRef, useCallback, useEffect } from 'react';
import { Button, Toast, ToastTitle, Toaster, useId, useToastController } from '@fluentui/react-components';
import { MicRegular, MicOffRegular } from '@fluentui/react-icons';
import styles from './VoiceInput.module.css';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
  resumeSignal: number;
  disabled?: boolean;
  language?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({
  onTranscript,
  enabled,
  onEnabledChange,
  resumeSignal,
  disabled = false,
  language = 'pt-BR',
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const toasterId = useId('voice-toaster');
  const { dispatchToast } = useToastController(toasterId);

  const stopRecognition = useCallback(() => {
    recognitionRef.current?.abort();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const startRecognition = useCallback(() => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      onEnabledChange(false);
      dispatchToast(
        <Toast><ToastTitle>Conversa por voz não é compatível com este navegador.</ToastTitle></Toast>,
        { intent: 'warning' },
      );
      return;
    }

    stopRecognition();
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .filter(result => result.isFinal)
        .map(result => result[0]?.transcript?.trim())
        .filter(Boolean)
        .join(' ');
      if (transcript) {
        onTranscript(transcript);
      }
    };
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
    };
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      recognitionRef.current = null;
      setIsListening(false);
      const message =
        event.error === 'not-allowed' ? 'Permita o acesso ao microfone para usar o modo de voz.' :
        event.error === 'network' ? 'Falha de rede no reconhecimento de voz.' :
        event.error === 'no-speech' ? 'Nenhuma fala detectada. Toque no microfone para tentar novamente.' :
        undefined;
      if (message) {
        dispatchToast(<Toast><ToastTitle>{message}</ToastTitle></Toast>, { intent: 'warning' });
      }
      if (event.error === 'not-allowed') onEnabledChange(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [dispatchToast, language, onEnabledChange, onTranscript, stopRecognition]);

  useEffect(() => {
    if (enabled && !disabled) startRecognition();
    else if (!enabled) stopRecognition();
    return stopRecognition;
  // `disabled` is intentionally handled separately: after a question is sent,
  // listening resumes only when the spoken answer increments resumeSignal.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, resumeSignal, startRecognition, stopRecognition]);

  useEffect(() => {
    if (disabled) stopRecognition();
  }, [disabled, stopRecognition]);

  const toggleVoiceMode = () => {
    const next = !enabled;
    window.speechSynthesis?.cancel();
    onEnabledChange(next);
    dispatchToast(
      <Toast><ToastTitle>{next ? 'Modo de voz pt-BR ativado. Fale agora.' : 'Modo de voz desativado.'}</ToastTitle></Toast>,
      { intent: next ? 'success' : 'info' },
    );
  };

  return (
    <>
      <Toaster toasterId={toasterId} position="top-end" />
      <Button
        appearance={enabled ? 'primary' : 'subtle'}
        icon={enabled ? <MicOffRegular /> : <MicRegular />}
        onClick={toggleVoiceMode}
        disabled={disabled && !enabled}
        aria-label={enabled ? 'Encerrar conversa por voz' : 'Iniciar conversa por voz em português brasileiro'}
        title={enabled ? (isListening ? 'Ouvindo… toque para encerrar' : 'Modo de voz ativo') : 'Conversa por voz opcional (pt-BR)'}
        aria-pressed={enabled}
        className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
      >
        {isListening && <span className={styles.pulsingDot} />}
      </Button>
    </>
  );
};
