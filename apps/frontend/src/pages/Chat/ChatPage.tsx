import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getChats } from '@/app/chat/ChatThunks';
import PageHeader from '@/pages/PageHeader';
import ChatTabs from './ChatTabs';
import { VirtualAssistantChat } from './Components/VirtualAssistantChatComponents/VirtualAssistantChat';
import Chat from './Components/ChatComponents/Chat';

const ChatPage = () => {
  const dispatch = useAppDispatch();

  const role = useAppSelector(state => state.user.data.role);
  const chats = useAppSelector(state => state.chat.chats);

  const location = useLocation();
  const getSelected = (to: string) => {
    return location.pathname.startsWith('/chats' + to);
  };

  useEffect(() => {
    dispatch(getChats({}));
  }, []);

  return (
    <div className='flex h-full flex-col'>
      <div className=''>
        <PageHeader iconVariant={'chats'} title='Chats' className='mb-0' />
      </div>
      <div className='section flex flex-1 grid-rows-[auto_1fr] flex-col overflow-hidden pt-6'>
        <ChatTabs role={role} countChats={chats.totalChats} />

        {getSelected('/my') && <Chat />}
        {getSelected('/assistant') && <VirtualAssistantChat />}
      </div>
    </div>
  );
};

export default ChatPage;
