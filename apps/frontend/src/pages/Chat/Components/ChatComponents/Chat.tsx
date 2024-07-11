import { useAppDispatch, useAppSelector } from '@/app/hooks';
import ChatList from './ChatList/ChatList';
import { Fragment, useEffect, useState } from 'react';
import { handleNewChat, handleMessages } from '@/app/chat/ChatActions';
import { getChatAttachments, getChatMessages } from '@/app/chat/ChatThunks';
import { cn } from '@/utils/cn';
import useWindowWide from '@/hooks/useWindowWide';
import ChatBody from './ChatBody/ChatBody';
import { closeChat } from '@/app/chat/ChatSlice';
import AttachedFiles from './AttachedFiles/AttachedFiles';
import { Icon } from '@/components/UI';
import socket from '@/app/socket/socket';

const Chat = () => {
  const dispatch = useAppDispatch();
  const w1024 = useWindowWide(1024);
  const w1280 = useWindowWide(1280);

  const role = useAppSelector(state => state.user.data.role);
  const chats = useAppSelector(state => state.chat.chats);
  const openedChat = useAppSelector(state => state.chat.openedChat);
  const isOpenedChat = useAppSelector(state => state.chat.isOpenedChat);
  const chatMessages = useAppSelector(state => state.chat.chatMessages);
  const [openAttachedFiles, setAttachedFiles] = useState(false);

  useEffect(() => {
    dispatch(handleNewChat(socket));
    dispatch(handleMessages(socket, chats.chats));
  }, [chats.chats]);

  useEffect(() => {
    if (openedChat) {
      dispatch(getChatMessages({ chatId: openedChat.id }));
      dispatch(getChatAttachments({ chatId: openedChat.id }));
    }
  }, [openedChat]);

  const chatAttachedFiles = useAppSelector(state => state.chat.chatAttachedFiles);

  useEffect(() => {
    if (w1280) {
      setAttachedFiles(false);
    }
  }, [w1280]);

  const handleBackToChats = () => {
    dispatch(closeChat());
  };

  const handleBackToChat = () => {
    setAttachedFiles(false);
  };

  const handleOpenAttachments = () => {
    setAttachedFiles(true);
  };

  return (
    <div className='relative grid h-full max-w-full grid-cols-[minmax(250px,25%)_auto] overflow-hidden rounded-xl rounded-ss-none max-lg:grid-cols-[1fr]'>
      <ChatList chats={chats} className={cn(!w1024 ? 'absolute inset-0 z-[1]' : '')} />

      <div className='relative flex w-full overflow-hidden'>
        {!isOpenedChat ? (
          w1024 && (
            <div className='flex flex-1 flex-col items-center justify-center'>
              <div className='italic'>Select a chat to messaging</div>
            </div>
          )
        ) : (
          <Fragment>
            <ChatBody
              chat={openedChat!}
              chatMessages={chatMessages}
              className={cn(
                'border-l border-l-grey-5 max-lg:border-l-0',
                !w1024
                  ? 'absolute inset-0 z-[1] translate-x-full transition-all ' + (isOpenedChat ? 'translate-x-0' : '')
                  : '',
              )}
              role={role}
              showBackBtn={!w1024}
              showFilesBtn={!w1280}
              handleBackToChats={handleBackToChats}
              handleOpenAttachments={handleOpenAttachments}
            />

            <AttachedFiles
              beforeChildren={
                !w1280 && (
                  <button type='button' onClick={handleBackToChat}>
                    <Icon
                      variant='arrow-right'
                      className='size-10 rotate-180 text-grey-1 transition-all hover:text-dark-grey'
                    />
                  </button>
                )
              }
              chatAttachedFiles={chatAttachedFiles}
              className={cn(
                'border-l border-l-grey-5 transition-all',
                !w1280 ? 'absolute inset-0 z-10 translate-x-full border-l-0' : 'max-w-64',
                openAttachedFiles ? 'translate-x-0' : '',
              )}
            />
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Chat;
