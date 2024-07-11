import type { TAttachments } from '@/dataTypes/Chat';
import AttachedFile from './AttachedFile';
import { cn } from '@/utils/cn';
import { useRef, type ReactNode } from 'react';
import BookAppointmentBtn from './BookAppointmentBtn';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getChatAttachments } from '@/app/chat/ChatThunks';

export type AttachedFilesProps = {
  chatAttachedFiles: TAttachments;
  className?: string;
  beforeChildren?: ReactNode;
};

const AttachedFiles = ({ chatAttachedFiles, className = '', beforeChildren }: AttachedFilesProps) => {
  const dispatch = useAppDispatch();
  const openedChat = useAppSelector(state => state.chat.openedChat);
  const attachedFilesRef = useRef<HTMLDivElement>(null);
  useInfiniteScroll(
    attachedFilesRef,
    () => {
      if (chatAttachedFiles.totalAttachments > chatAttachedFiles.attachments.length) {
        if (openedChat)
          dispatch(getChatAttachments({ chatId: openedChat.id, skip: chatAttachedFiles.attachments.length }));
      }
    },
    [chatAttachedFiles.attachments],
  );

  return (
    <>
      <div
        ref={attachedFilesRef}
        className={cn('relative col-span-1 flex h-full flex-col overflow-y-auto rounded-r-lg bg-white ', className)}
      >
        <div className='sticky top-0 flex flex-shrink-0 items-center gap-2 bg-white p-6 pb-3'>
          {beforeChildren}
          <h3 className='text-lg font-medium text-black'>Attached files</h3>
        </div>

        {chatAttachedFiles.attachments.length > 0 ? (
          <div className='list flex flex-1 flex-col gap-3 px-6'>
            {chatAttachedFiles.attachments.map((attach, index) => (
              <AttachedFile key={index} fileName={attach.attachmentKey} />
            ))}
          </div>
        ) : null}

        <BookAppointmentBtn />
      </div>
    </>
  );
};

export default AttachedFiles;
