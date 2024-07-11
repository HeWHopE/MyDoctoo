import type { TAttachment } from '@/dataTypes/Chat';
import { cn } from '@/utils/cn';
import DayJS from 'dayjs';
import React from 'react';
import AttachedFile from '../AttachedFiles/AttachedFile';

type MessageItemProps = {
  sender: 'me' | 'participant';
  text: string;
  sentAt: Date | string;
  attaches?: TAttachment[];
};

const MessageItem = React.forwardRef<HTMLDivElement, MessageItemProps>(
  ({ text, sender = 'participant', sentAt, attaches }, ref) => {
    function splitLongWords(text: string, maxLength: number) {
      const words = text.split(' ');
      const newWords = [];

      for (const word of words) {
        if (word.length > maxLength) {
          const chunks = word.match(new RegExp('.{1,' + maxLength + '}', 'g'));
          newWords.push(...chunks!.map(chunk => chunk + '\n'));
        } else {
          newWords.push(word);
        }
      }

      return newWords.join(' ');
    }
    const maxLength = 45;
    const splitText = splitLongWords(text, maxLength);

    return (
      <div
        ref={ref}
        className={cn(sender !== 'participant' ? 'text-white max-[1440px]:self-end' : 'max-[1440px]:self-start')}
      >
        <div
          className={cn(
            'flex max-w-80 flex-col gap-4 rounded-lg p-5 max-sm:p-3',
            sender !== 'participant' ? 'bg-main' : 'bg-white',
          )}
        >
          <pre className='text w-full whitespace-pre-wrap font-sans text-base'>{splitText}</pre>
          {attaches && attaches.length > 0 && (
            <div className='grid gap-2'>
              {attaches.map((attach, index) => {
                return (
                  <div key={index}>
                    {attach.attachmentKey.toLowerCase().endsWith('.jpg') ||
                    attach.attachmentKey.toLowerCase().endsWith('.png') ||
                    attach.attachmentKey.toLowerCase().endsWith('.gif') ? (
                      <img
                        className='max-w-full object-contain'
                        src={`${import.meta.env.VITE_S3_BASE_URL}/${attach.attachmentKey}`}
                        alt={`Image ${index}`}
                      />
                    ) : (
                      <AttachedFile fileName={attach.attachmentKey} />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <span className='text-xs text-grey-2'>{DayJS.utc(sentAt).format('hh:mm a')}</span>
      </div>
    );
  },
);

MessageItem.displayName = 'MessageItem';

export default MessageItem;
