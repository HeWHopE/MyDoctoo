import { cn } from '@/utils/cn';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

type ChatTextAreaProps = {
  value?: string;
  handleEnterPress?: (value: string) => void;
  handleChange?: (value: string) => void;
  className?: string;
};

const ChatTextArea = ({
  value = '',
  className = '',
  handleChange = () => {},
  handleEnterPress = () => {},
}: ChatTextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaValue, setTextAreaValue] = useState('');
  const [baseHeight, setBaseHeight] = useState(0);

  useEffect(() => {
    setTextAreaValue(value);
  }, [value]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      setBaseHeight(textarea.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && baseHeight > 0) {
      const heightTextArea = textarea?.scrollHeight;
      if (textAreaValue === '') {
        textarea.style.height = `${baseHeight}px`;
      } else {
        textarea.style.height = `${baseHeight}px`;
        textarea.style.height = `${Math.min(heightTextArea, baseHeight * 6)}px`;
      }
    }
  }, [textAreaValue, baseHeight]);

  const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaValue(e.target.value);
    handleChange(e.target.value);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.key === 'Enter' && e.shiftKey) && e.key === 'Enter') {
      e.preventDefault();
      handleEnterPress(textAreaValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.key === 'Enter' && e.shiftKey) && e.key === 'Enter') {
      e.preventDefault(); // Prevent the default behavior of the Enter key
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={textAreaValue}
      onChange={onChange}
      placeholder='Write a message...'
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
      className={cn(
        'text-gray-2 h-5 max-h-64 w-full flex-1 resize-none self-center overflow-y-auto text-sm font-medium focus:outline-none',
        className,
      )}
    />
  );
};

export default ChatTextArea;
