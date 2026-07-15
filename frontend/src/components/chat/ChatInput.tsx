import { useState, useRef, useEffect } from 'react';
import {
  ChatInput as ChatInputFluent,
  ImperativeControlPlugin,
  type ImperativeControlPluginRef,
} from '@fluentui-copilot/react-copilot';
import { Button, Toast, ToastTitle, Toaster, useId, useToastController, Menu, MenuTrigger, MenuPopover, MenuList, MenuItem } from '@fluentui/react-components';
import { Attach24Regular, Stop24Regular, MoreHorizontal24Regular, History24Regular, Settings24Regular, ChatAdd24Regular, ArrowDownload24Regular, Keyboard24Regular } from '@fluentui/react-icons';
import { FilePreview } from './FilePreview';
import { VoiceInput } from './VoiceInput';
import { MessageQueue } from './MessageQueue';
import { validateFile, validateFileCount } from '../../utils/fileAttachments';
import styles from './ChatInput.module.css';

const CHAR_MAX_INPUT = 50_000;
const LONG_TEXT_ATTACHMENT_PROMPT = 'Analise o conteúdo completo do arquivo de texto anexado.';

const createLongTextAttachment = (text: string) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return new File([text], `mensagem-longa-${timestamp}.txt`, { type: 'text/plain' });
};

interface ChatInputProps {
  onSubmit: (value: string, files?: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
  onOpenSettings?: () => void;
  onNewChat?: () => void;
  onToggleSidebar?: () => void;
  onExportConversation?: () => void;
  onShowShortcuts?: () => void;
  hasMessages?: boolean;
  isStreaming?: boolean;
  onCancelStream?: () => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  recoveredInput?: string;
  recoveredAttachments?: import('../../types/chat').IFileAttachment[];
  onRecoveredInputConsumed?: () => void;
  pendingMessages?: Array<{ text: string; files?: File[] }>;
  onDequeueMessage?: (index: number) => void;
  droppedFiles?: File[];
  onDroppedFilesConsumed?: () => void;
  voiceMode: boolean;
  onVoiceModeChange: (enabled: boolean) => void;
  voiceResumeSignal: number;
}

const focusInput = (containerRef: React.RefObject<HTMLDivElement | null>) => {
  const editableDiv = containerRef.current?.querySelector('[contenteditable="true"]') as HTMLElement;
  if (editableDiv) {
    editableDiv.focus();
  }
};

export const ChatInput: React.FC<ChatInputProps> = ({
  onSubmit,
  disabled = false,
  placeholder = "Type your message...",
  onOpenSettings,
  onNewChat,
  onToggleSidebar,
  onExportConversation,
  onShowShortcuts,
  hasMessages = false,
  isStreaming = false,
  onCancelStream,
  isEditing = false,
  onCancelEdit,
  recoveredInput,
  recoveredAttachments,
  onRecoveredInputConsumed,
  pendingMessages = [],
  onDequeueMessage,
  droppedFiles,
  onDroppedFilesConsumed,
  voiceMode,
  onVoiceModeChange,
  voiceResumeSignal,
}) => {
  const [inputText, setInputText] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const controlRef = useRef<ImperativeControlPluginRef>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);

  // Auto-focus on mount for immediate typing
  useEffect(() => {
    if (!disabled) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => focusInput(inputContainerRef), 100);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Restore focus after message is sent (when status changes from disabled back to enabled)
  useEffect(() => {
    if (!disabled && !isStreaming) {
      // Small delay to allow state to settle
      const timer = setTimeout(() => focusInput(inputContainerRef), 50);
      return () => clearTimeout(timer);
    }
  }, [disabled, isStreaming]);

  // Focus input when messages are cleared (new chat button clicked)
  useEffect(() => {
    if (!hasMessages && !disabled) {
      // Delay to ensure state has settled after clearing
      const timer = setTimeout(() => focusInput(inputContainerRef), 100);
      return () => clearTimeout(timer);
    }
  }, [hasMessages, disabled]);

  useEffect(() => {
    if (recoveredInput) {
      setInputText(recoveredInput);
      controlRef.current?.setInputText(recoveredInput);
      // Restore attachments by converting dataURIs back to Files
      if (recoveredAttachments?.length) {
        for (const att of recoveredAttachments) {
          if (att.dataUri) {
            try {
              const res = fetch(att.dataUri);
              res.then(r => r.blob()).then(blob => {
                const file = new File([blob], att.fileName, { type: blob.type });
                setSelectedFiles(prev => [...prev, file]);
              });
            } catch { /* skip unrecoverable attachments */ }
          }
        }
      }
      onRecoveredInputConsumed?.();
      const timer = setTimeout(() => focusInput(inputContainerRef), 50);
      return () => clearTimeout(timer);
    }
  }, [recoveredInput, recoveredAttachments, onRecoveredInputConsumed]);

  // Clear input when edit is cancelled
  const prevEditingRef = useRef(isEditing);
  useEffect(() => {
    if (prevEditingRef.current && !isEditing) {
      setInputText("");
      controlRef.current?.setInputText("");
      setSelectedFiles([]);
    }
    prevEditingRef.current = isEditing;
  }, [isEditing]);

  // Accept files from drag-drop via parent
  useEffect(() => {
    if (droppedFiles && droppedFiles.length > 0) {
      const countValidation = validateFileCount(droppedFiles, selectedFiles.length);
      if (!countValidation.valid) {
        dispatchToast(
          <Toast>
            <ToastTitle>{countValidation.error}</ToastTitle>
          </Toast>,
          { intent: 'warning' },
        );
      } else {
        const validFiles: File[] = [];
        for (const file of droppedFiles) {
          const validation = validateFile(file);
          if (validation.valid) {
            validFiles.push(file);
          } else {
            dispatchToast(
              <Toast>
                <ToastTitle>{validation.error}</ToastTitle>
              </Toast>,
              { intent: 'error' },
            );
          }
        }
        if (validFiles.length > 0) {
          setSelectedFiles(prev => [...prev, ...validFiles]);
        }
      }
      onDroppedFilesConsumed?.();
    }
  }, [droppedFiles, onDroppedFilesConsumed, selectedFiles.length, dispatchToast]);

  const handleSubmit = () => {
    const trimmedInput = inputText.trim();
    if (trimmedInput !== "") {
      let message = trimmedInput;
      let files = selectedFiles;

      if (trimmedInput.length > CHAR_MAX_INPUT) {
        const textAttachment = createLongTextAttachment(trimmedInput);
        const countValidation = validateFileCount([textAttachment], selectedFiles.length);
        const fileValidation = validateFile(textAttachment);

        if (!countValidation.valid || !fileValidation.valid) {
          dispatchToast(
            <Toast>
              <ToastTitle>{countValidation.error || fileValidation.error}</ToastTitle>
            </Toast>,
            { intent: 'error' },
          );
          return;
        }

        message = LONG_TEXT_ATTACHMENT_PROMPT;
        files = [...selectedFiles, textAttachment];
      }

      onSubmit(message, files.length > 0 ? files : undefined);
      setInputText("");
      setSelectedFiles([]);
      controlRef.current?.setInputText("");
    }
  };

  const handleCancelStream = () => {
    onCancelStream?.();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file count first
    const countValidation = validateFileCount(files, selectedFiles.length);
    if (!countValidation.valid) {
      dispatchToast(
        <Toast>
          <ToastTitle>{countValidation.error}</ToastTitle>
        </Toast>,
        { intent: 'warning' }
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        dispatchToast(
          <Toast>
            <ToastTitle>{validation.error}</ToastTitle>
          </Toast>,
          { intent: 'error' }
        );
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
    
    // Reset input value so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePaste = async (event: React.ClipboardEvent) => {
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    if (pastedText.length > CHAR_MAX_INPUT) {
      event.preventDefault();

      const textAttachment = createLongTextAttachment(pastedText);
      const countValidation = validateFileCount([textAttachment], selectedFiles.length);
      const fileValidation = validateFile(textAttachment);

      if (!countValidation.valid || !fileValidation.valid) {
        dispatchToast(
          <Toast>
            <ToastTitle>{countValidation.error || fileValidation.error}</ToastTitle>
          </Toast>,
          { intent: 'error' },
        );
        return;
      }

      setSelectedFiles(prev => [...prev, textAttachment]);
      if (!inputText.trim()) {
        setInputText(LONG_TEXT_ATTACHMENT_PROMPT);
        controlRef.current?.setInputText(LONG_TEXT_ATTACHMENT_PROMPT);
      }
      dispatchToast(
        <Toast>
          <ToastTitle>Texto com mais de 50.000 caracteres anexado automaticamente como TXT.</ToastTitle>
        </Toast>,
        { intent: 'success' },
      );
      return;
    }

    const items = event.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length === 0) return;

    // Validate file count
    const countValidation = validateFileCount(files, selectedFiles.length);
    if (!countValidation.valid) {
      event.preventDefault();
      dispatchToast(
        <Toast>
          <ToastTitle>{countValidation.error}</ToastTitle>
        </Toast>,
        { intent: 'warning' }
      );
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        dispatchToast(
          <Toast>
            <ToastTitle>{validation.error}</ToastTitle>
          </Toast>,
          { intent: 'error' }
        );
      } else {
        validFiles.push(file);
      }
    }

    if (validFiles.length > 0) {
      event.preventDefault();
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Escape to cancel streaming
    if (event.key === 'Escape' && isStreaming) {
      event.preventDefault();
      handleCancelStream();
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setInputText('');
    controlRef.current?.setInputText('');
    onSubmit(transcript);
  };

  return (
    <>
      <Toaster toasterId={toasterId} position="top-end" />
      <div className={styles.chatInputContainer} onPaste={handlePaste} onKeyDown={handleKeyDown} ref={inputContainerRef}>
        <FilePreview 
          files={selectedFiles}
          onRemove={handleRemoveFile}
          disabled={disabled}
        />
        <div className={styles.inputWrapper}>
        <ChatInputFluent
          aria-label="Chat Input"
          charactersRemainingMessage={() => ``}
          disabled={disabled}
          history={true}
          maxLength={CHAR_MAX_INPUT}
          onChange={(_, data) => setInputText(data.value)}
          onSubmit={handleSubmit}
          placeholderValue={placeholder}
        >
          <ImperativeControlPlugin ref={controlRef} />
        </ChatInputFluent>
        {pendingMessages.length > 0 && onDequeueMessage && (
          <MessageQueue messages={pendingMessages} onRemove={onDequeueMessage} />
        )}
        <div className={styles.buttonRow}>
          <div className={styles.actionButtons}>
            <Button
              appearance="subtle"
              icon={<Attach24Regular />}
              onClick={handleAttachClick}
              disabled={disabled}
              aria-label="Attach files"
            />
            <Button
              appearance="subtle"
              icon={<Stop24Regular />}
              onClick={isEditing ? onCancelEdit : handleCancelStream}
              disabled={!isStreaming && !isEditing}
              aria-label={isEditing ? "Cancel edit" : "Cancel response"}
              title={isEditing ? "Cancel edit" : undefined}
              className={styles.cancelButton}
            />
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              disabled={disabled}
              language="pt-BR"
              enabled={voiceMode}
              onEnabledChange={onVoiceModeChange}
              resumeSignal={voiceResumeSignal}
            />
            {onNewChat && (
              <Button
                appearance="subtle"
                icon={<ChatAdd24Regular />}
                onClick={onNewChat}
                disabled={disabled || !hasMessages}
                aria-label="New chat"
              />
            )}
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  appearance="subtle"
                  icon={<MoreHorizontal24Regular />}
                  aria-label="More options"
                />
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  {onToggleSidebar && (
                    <MenuItem icon={<History24Regular />} onClick={onToggleSidebar} disabled={disabled}>
                      Conversation history
                    </MenuItem>
                  )}
                  {onExportConversation && (
                    <MenuItem icon={<ArrowDownload24Regular />} onClick={onExportConversation} disabled={disabled || !hasMessages}>
                      Export as Markdown
                    </MenuItem>
                  )}
                  {onShowShortcuts && (
                    <MenuItem icon={<Keyboard24Regular />} onClick={onShowShortcuts}>
                      Keyboard shortcuts
                    </MenuItem>
                  )}
                  {onOpenSettings && (
                    <MenuItem icon={<Settings24Regular />} onClick={onOpenSettings} disabled={disabled}>
                      Settings
                    </MenuItem>
                  )}
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        accept="image/*,.pdf,.txt,.md,.csv,.json,.html,.xml"
        aria-label="Upload files"
      />
    </div>
    </>
  );
};
