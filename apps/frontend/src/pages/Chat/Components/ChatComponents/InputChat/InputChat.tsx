import { Button, Icon } from '@/components/UI';
import { useEffect, useState } from 'react';
import AddAttachmentsPopup from '../Popups/AddAttachmentsPopup';
import ChatTextArea from './ChatTextArea';
import InputFile from './InputFile';

interface InputChatProps {
  className?: string;
  handleChange?: (value: string) => void;
  onSend?: (formData: FormData) => boolean;
}

const InputChat: React.FC<InputChatProps> = ({
  className,
  handleChange = () => {},
  onSend = () => {
    return true;
  },
}) => {
  const [isAddAttachmentsPopupOpen, setIsAddAttachmentsPopupOpen] = useState(false);
  const [localInputValue, setLocalInputValue] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onChangeTextArea = (value: string) => {
    setLocalInputValue(value);
    handleChange(value);
  };

  const handleSend = (value: string) => {
    if (value.trim() !== '') {
      const messages: string[] = [];
      let remainingValue = value.trim();
      while (remainingValue.length > 0) {
        const message = remainingValue.substring(0, 600);
        messages.push(message);
        remainingValue = remainingValue.substring(600);
      }

      messages.forEach((message, index) => {
        const formData = new FormData();
        formData.append('text', message);
        formData.append('sentAt', new Date().toISOString());
        if (index === 0 && selectedFiles.length > 0) {
          selectedFiles.forEach(file => {
            formData.append('files', file);
          });
        }

        const success = onSend(formData);
        if (success || index === messages.length - 1) {
          setLocalInputValue('');
          setSelectedFiles([]);
        }
      });
    }
  };

  useEffect(() => {
    setIsAddAttachmentsPopupOpen(selectedFiles.length > 0);
  }, [selectedFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray: File[] = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...filesArray]);
    }
  };

  const handleCloseAddAttachmentsPopup = () => {
    setIsAddAttachmentsPopupOpen(false);
    setSelectedFiles([]);
    setLocalInputValue('');
  };

  const deleteFile = (index: number) => {
    setSelectedFiles(prevFiles =>
      prevFiles.filter((_, i) => {
        i !== index;
      }),
    );
  };

  return (
    <div className='relative w-full'>
      <div className={'flex w-full items-end gap-2 bg-white px-6 py-4 ' + className}>
        <div className='mb-2 flex flex-1 gap-2'>
          <InputFile handleFileSelect={handleFileSelect} />

          <ChatTextArea
            value={localInputValue}
            handleChange={onChangeTextArea}
            handleEnterPress={value => {
              handleSend(value);
            }}
          />
        </div>

        <Button
          btnType='button'
          type='primary'
          disabled={localInputValue.trim() === ''}
          className='size-10 min-w-10 p-2'
          onClick={() => {
            handleSend(localInputValue);
          }}
        >
          <Icon variant='send-message' className='text-white' />
        </Button>
      </div>

      <AddAttachmentsPopup
        isOpen={isAddAttachmentsPopupOpen}
        onClose={handleCloseAddAttachmentsPopup}
        inputText={localInputValue}
        files={selectedFiles}
        handleSend={v => {
          handleSend(v);
        }}
        handleFileSelect={handleFileSelect}
        deleteFile={deleteFile}
      />
    </div>
  );
};

export default InputChat;
