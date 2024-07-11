import React, { useEffect, useRef, useState } from 'react';
import { InputSearch } from '@/components/UI';
import ChatItem from './ChatItem';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useLocation } from 'react-router';
import { cn } from '@/utils/cn';
import type { TChat, TChatMessagesSearchResult, TChats } from '@/dataTypes/Chat';
import { getChats, searchChats } from '@/app/chat/ChatThunks';
import { resetsetSearchedChats } from '@/app/chat/ChatSlice';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

type ChatListProps = {
  chats: TChats;
  className?: string;
};

const ChatList = ({ chats, className = '' }: ChatListProps) => {
  const dispatch = useAppDispatch();
  const searchedChats = useAppSelector(state => state.chat.searchedChats);
  const [searchText, setSearchText] = useState('');
  const location = useLocation();
  const openedChat = useAppSelector(state => state.chat.openedChat);
  const isOpenedChat = useAppSelector(state => state.chat.isOpenedChat);
  const scrolledRef = useRef<HTMLButtonElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchText) {
      dispatch(searchChats(searchText));
    }
  }, [searchText, dispatch]);

  useEffect(() => {
    if (openedChat) {
      dispatch(resetsetSearchedChats());
      setSearchText('');
    }
  }, [openedChat]);

  useEffect(() => {
    if (scrolledRef && scrolledRef.current) {
      scrolledRef.current.scrollIntoView({ block: 'center', inline: 'nearest' });
    }
  }, [scrolledRef.current]);

  useInfiniteScroll(
    chatListRef,
    () => {
      if (chats.totalChats > chats.chats.length) {
        dispatch(getChats({ skip: chats.chats.length }));
      }
    },
    [chats],
  );

  const getSelected = (to: string) => location.pathname.startsWith(to);
  const active = openedChat && getSelected('/chats/my');

  const renderChatItems = (chatItems: TChat[] | TChatMessagesSearchResult[]) =>
    chatItems.map((chatItem, index) => (
      <React.Fragment key={'chat' + index}>
        <ChatItem
          chat={chatItem}
          active={openedChat?.id === chatItem.id && isOpenedChat}
          ref={openedChat?.id === chatItem.id ? scrolledRef : null}
        />
        {index < chatItems.length - 1 ? <span className='block h-px bg-grey-5'></span> : null}
      </React.Fragment>
    ));

  const renderSearchedChatList = () => {
    const { namesSearchResults, messagesSearchResults } = searchedChats;

    return (
      <div className='list flex flex-col gap-3'>
        {renderChatItems(namesSearchResults)}
        {messagesSearchResults.length > 0 && (
          <span className='bg-background p-1 text-center text-sm'>
            Found {messagesSearchResults.length} message{messagesSearchResults.length > 1 && 's'}
          </span>
        )}
        {renderChatItems(messagesSearchResults)}
        {!(namesSearchResults.length || messagesSearchResults.length) && (
          <div className='px-6 py-2 text-center italic'>Nothing found</div>
        )}
      </div>
    );
  };

  return (
    <div ref={chatListRef} className={cn('relative max-h-full overflow-y-auto ', className)}>
      <div className={cn('flex flex-col self-start bg-white pb-6', active ? 'rounded-es-xl' : 'rounded-b-xl')}>
        <div className='sticky top-0 bg-white p-6'>
          <InputSearch
            value={searchText}
            setValue={setSearchText}
            variant='grey'
            placeholder='Search'
            className='w-full'
          />
        </div>
        {searchText === '' ? (
          <div className='list flex flex-col gap-3'>
            {chats.chats && chats.chats.length > 0 ? (
              renderChatItems(chats.chats)
            ) : (
              <div className='px-6 py-2 text-center italic'>You don&apos;t have any chats yet.</div>
            )}
          </div>
        ) : (
          renderSearchedChatList()
        )}
      </div>
    </div>
  );
};

export default ChatList;
