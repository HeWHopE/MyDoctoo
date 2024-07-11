import { Button, Icon, PopupDoctoo } from '@/components/UI';
import ChatTextArea from '../InputChat/ChatTextArea';
import { Fragment, useState } from 'react';
import InputFile from '../InputChat/InputFile';
import { cn } from '@/utils/cn';
import AttachedFile from '../AttachedFiles/AttachedFile';

type AddAttachmentsPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  inputText?: string;
  files: File[];
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  deleteFile?: (index: number) => void;
  handleSend?: (value: string) => void;
};

const AddAttachmentsPopup = ({
  isOpen,
  onClose,
  inputText = '',
  files = [],
  handleFileSelect = () => {},
  deleteFile = () => {},
  handleSend = () => {},
}: AddAttachmentsPopupProps) => {
  const [textAreaValue, setTextAreaValue] = useState(inputText);

  const onChangeTextArea = (value: string) => {
    setTextAreaValue(value);
  };

  const countAttachImages = () => {
    let count = 0;
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        count++;
      }
    });
    return count;
  };

  const DeleteButton = ({ index }: { index: number }) => {
    return (
      <button
        type='button'
        className='z-1 pointer-events-none absolute right-2 top-2 rounded bg-error p-1 opacity-0 group-hover:pointer-events-auto group-hover:opacity-100'
        onClick={() => {
          deleteFile(index);
        }}
      >
        <Icon variant='delete' className='text-white' />
      </button>
    );
  };

  return (
    <PopupDoctoo
      popupIsOpen={isOpen}
      closePopup={onClose}
      modalFullClassName='max-w-[508px]'
      modalBodyClassName='relative z-20 flex h-full max-w-128 flex-col gap-3 rounded-xl bg-white'
    >
      <div className='flex items-center justify-between'>
        <h2>Attachments</h2>
        <InputFile handleFileSelect={handleFileSelect} />
      </div>
      <div className='flex max-h-72 flex-col gap-2 overflow-y-auto'>
        <div
          className={cn(
            'grid w-full gap-1 ',
            countAttachImages() > 2 ? 'grid-cols-3' : `grid-cols-2`,
            countAttachImages() === 1 && 'flex h-64 items-center justify-center',
          )}
        >
          {files.map((file, index) => (
            <Fragment key={index}>
              {file.type.startsWith('image/') && (
                <div className='group relative h-full w-full bg-grey-5'>
                  <img
                    className='pointer-events-none relative h-full w-full bg-grey-5 object-contain object-center'
                    src={URL.createObjectURL(file)}
                    alt={`Image ${index + 1}`}
                  />

                  <DeleteButton index={index} />
                </div>
              )}
            </Fragment>
          ))}
        </div>
        <div className={cn('grid w-full gap-2 pr-1')}>
          {files.map((file, index) => (
            <Fragment key={index}>
              {!file.type.startsWith('image/') && (
                <div className='group relative w-full'>
                  <AttachedFile fileName={file.name} />

                  <DeleteButton index={index} />
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      <div className='w-full'>
        <label className='mb-2 block text-black-2'>Message</label>
        <div className='flex items-center gap-2'>
          <div className='flex-1 border-b border-grey-1 pb-1'>
            <ChatTextArea
              value={inputText}
              handleChange={onChangeTextArea}
              handleEnterPress={() => handleSend(textAreaValue)}
            />
          </div>

          <Button
            btnType='button'
            type='primary'
            disabled={textAreaValue.trim() === ''}
            className='size-10 min-w-10 p-2'
            onClick={() => {
              handleSend(textAreaValue);
            }}
          >
            <Icon variant='send-message' className='text-white' />
          </Button>
        </div>
      </div>
    </PopupDoctoo>
  );
};

export default AddAttachmentsPopup;
