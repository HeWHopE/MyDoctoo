import DayJS from 'dayjs';
import { Fragment } from 'react/jsx-runtime';
import MessageItem from './MessageItem';
import { cn } from '@/utils/cn';
import ChatHeader from './ChatHeader';
import type { Role } from '@/dataTypes/User';
import { Icon } from '@/components/UI';
import InputChat from '../InputChat/InputChat';
import { useAppDispatch } from '@/app/hooks';
import { getChatMessages, sendMessage } from '@/app/chat/ChatThunks';
import type { TChat, TChatMessagesSearchResult, TMessage, TMessages } from '@/dataTypes/Chat';
import AppointmentMessage from './AppointmentMessage';
import { useEffect, useRef, useState } from 'react';
import { getAppointment } from '@/app/appointment/AppointmentThunks';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';

type ChatBodyProps = {
  chat: TChat | TChatMessagesSearchResult;
  chatMessages: TMessages;
  className?: string;
  role?: string | Role;
  showBackBtn?: boolean;
  handleBackToChats?: () => void;
  showFilesBtn?: boolean;
  handleOpenAttachments?: () => void;
};

const ChatBody = ({
  chat,
  chatMessages,
  className,
  role,
  showBackBtn = false,
  handleBackToChats = () => {},
  showFilesBtn = false,
  handleOpenAttachments = () => {},
}: ChatBodyProps) => {
  const dispatch = useAppDispatch();
  const [openedAppointmentId, setOpenedAppointmentId] = useState<string | null>(null);
  const scrolledRef = useRef<HTMLDivElement>(null);
  const bodyMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if ('searchedMessage' in chat) {
      const foundedMessage = chatMessages.messages.find(message => message.id === chat.searchedMessage?.id);
      if (!foundedMessage && chatMessages.totalMessages > chatMessages.messages.length) {
        dispatch(getChatMessages({ chatId: chat.id, skip: chatMessages.messages.length }));
      }
    }
  }, [chat, chatMessages]);

  useEffect(() => {
    if (bodyMessagesRef && bodyMessagesRef.current) {
      bodyMessagesRef.current.scrollTop = 0;
    }
  }, [chat, bodyMessagesRef]);

  useEffect(() => {
    if (scrolledRef && scrolledRef.current) {
      scrolledRef.current.scrollIntoView({ block: 'center', inline: 'nearest' });
    }
  }, [scrolledRef.current, chatMessages]);

  useEffect(() => {
    if (chatMessages.messages.length) {
      const message = chatMessages.messages.find(m => m.appointment?.id === openedAppointmentId);
      if (message && openedAppointmentId) {
        dispatch(getAppointment(openedAppointmentId));
      }
    }
  }, [chatMessages.messages]);

  useInfiniteScroll(
    bodyMessagesRef,
    () => {
      if (chatMessages.totalMessages > chatMessages.messages.length) {
        dispatch(getChatMessages({ chatId: chat.id, skip: chatMessages.messages.length }));
      }
    },
    [chatMessages],
    true,
  );

  const handleSend = (formData: FormData) => {
    let success = true;
    if (chat) {
      dispatch(sendMessage({ chatId: chat.id, messageData: formData })).then(res => {
        if ('error' in res) {
          success = false;
        }
      });
    }
    return success;
  };

  return (
    <div className='h-full flex-1'>
      <div className={cn('flex h-full flex-1 flex-col overflow-hidden bg-white ', className)}>
        {/* Chat header */}
        <ChatHeader
          participant={chat.participant}
          beforeChildren={
            showBackBtn && (
              <button type='button' onClick={handleBackToChats}>
                <Icon
                  variant='arrow-right'
                  className='size-10 rotate-180 text-grey-1 transition-all hover:text-dark-grey'
                />
              </button>
            )
          }
          afterChildren={
            showFilesBtn && (
              <button type='button' onClick={handleOpenAttachments} className='rounded-md bg-main p-2 text-white'>
                <Icon variant='file' className='size-6 text-white' />
              </button>
            )
          }
        />

        {/* Body messages */}
        <div
          ref={bodyMessagesRef}
          className='flex flex-grow flex-col-reverse items-start gap-4 overflow-y-auto bg-background px-5 py-3'
        >
          {chatMessages.messages.length ? (
            chatMessages.messages.map((message: TMessage, index) => {
              const currentDate = new Date(message.sentAt);
              const isFirstMessage = index === chatMessages.messages.length - 1;
              const previousMessageDate = isFirstMessage ? null : new Date(chatMessages.messages[index + 1].sentAt);
              const isDateDifferent =
                DayJS(currentDate).format('YYYY-MM-DD') !== DayJS(previousMessageDate).format('YYYY-MM-DD');
              let isOpenMessage = false;
              if ('searchedMessage' in chat) {
                isOpenMessage = chat.searchedMessage?.id === message.id;
              }

              return (
                <Fragment key={message.id}>
                  {!message.appointment ? (
                    <MessageItem
                      ref={isOpenMessage ? scrolledRef : null}
                      text={message.text}
                      sentAt={message.sentAt}
                      sender={message.sender === role || message.sender === role ? 'me' : 'participant'}
                      attaches={message.attachments}
                    />
                  ) : (
                    <AppointmentMessage
                      appointment={message.appointment}
                      className='self-center pb-4'
                      onClickViewDetails={appointmentId => setOpenedAppointmentId(appointmentId)}
                    />
                  )}
                  {isDateDifferent && (
                    <div className='self-center text-center text-sm text-grey-2'>
                      {DayJS(currentDate).format('D MMMM')}
                    </div>
                  )}
                </Fragment>
              );
            })
          ) : (
            <span className='w-full text-center italic'>No messages here yet.</span>
          )}
        </div>

        {/* Input */}
        <div className='flex-shrink-0'>
          <InputChat
            onSend={formData => {
              return handleSend(formData);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatBody;
