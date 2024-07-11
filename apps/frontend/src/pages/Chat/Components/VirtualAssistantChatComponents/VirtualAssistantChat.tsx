import { pushAssistantMessage } from '@/app/assistant/AssistantSlice';
import { createAssistantMessage, getAssistantMessages, initializeMessages } from '@/app/assistant/AssistantThunks';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Button, Icon, Spinner } from '@/components/UI';
import Markdown from 'react-markdown';
import dayjs from 'dayjs';
import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';
import DoctorCard from './components/DoctorCard';

export function VirtualAssistantChat() {
  const { id } = useAppSelector(state => state.patient.data);

  const { data: messages, isLoading } = useAppSelector(state => state.assistant);

  const [firstFetch, setFirstFetch] = useState(true);

  const [inputValue, setInputValue] = useState('');

  const lastMessage = useMemo(() => messages.at(-1), [messages]);

  const dispatch = useAppDispatch();
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inputValue === '') return;
    if (isLoading) return;
    setInputValue('');
    dispatch(
      pushAssistantMessage({
        content: inputValue,
        role: 'user',
        id: inputValue,
        sentAt: new Date().toUTCString(),
        doctors: [],
      }),
    );
    dispatch(createAssistantMessage({ patientId: id, content: inputValue }));
  }

  useEffect(() => {
    dispatch(getAssistantMessages());
  }, []);

  useEffect(() => {
    if (messages.length === 0 && firstFetch) {
      dispatch(initializeMessages());
      setFirstFetch(false);
    }
  }, [messages]);

  return (
    <div className='flex h-full flex-col overflow-y-auto rounded-b-xl rounded-r-xl bg-white'>
      <div className='flex w-full gap-3 p-8 '>
        <div className='h-fit w-fit rounded-lg bg-main p-[10px]'>
          <svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M15.3999 3.23077C15.3999 1.44646 16.8464 0 18.6307 0H19.1691C20.9534 0 22.3999 1.44647 22.3999 3.23077V12.6H15.3999V3.23077Z'
              fill='#FFC249'
            />
            <path
              d='M24.769 5.59961C26.5533 5.59961 27.9998 7.04607 27.9998 8.83038L27.9998 9.36884C27.9998 11.1531 26.5533 12.5996 24.769 12.5996L15.3998 12.5996L15.3998 5.59961L24.769 5.59961Z'
              fill='#FFC249'
            />
            <rect width='7' height='12.6' transform='matrix(1 0 0 -1 15.3999 28)' fill='white' />
            <rect
              width='7'
              height='12.6'
              transform='matrix(-4.37114e-08 -1 -1 4.37114e-08 27.9998 22.4004)'
              fill='white'
            />
            <rect width='7' height='12.6' transform='matrix(-1 0 0 1 12.6001 0)' fill='white' />
            <rect
              width='7'
              height='12.6'
              transform='matrix(4.37114e-08 1 1 -4.37114e-08 0.000244141 5.59961)'
              fill='white'
            />
            <rect x='12.6001' y='28' width='7' height='12.6' transform='rotate(180 12.6001 28)' fill='white' />
            <rect
              x='0.000244141'
              y='22.4004'
              width='7'
              height='12.6'
              transform='rotate(-90 0.000244141 22.4004)'
              fill='white'
            />
          </svg>
        </div>
        <div className='flex flex-col justify-between'>
          <div className='text-lg font-semibold text-black'>Your virtual assistant</div>
          <div className='font-medium text-grey-1'>Online</div>
        </div>
      </div>
      <div className='custom-scrollbar mx-2 flex h-full flex-col gap-3 overflow-y-auto bg-background p-4'>
        {messages.length !== 0 && (
          <>
            {messages.map(message => (
              <React.Fragment key={message.id}>
                <div className={`flex h-fit w-full ${message.role === 'user' ? 'justify-end' : 'items-start'}`}>
                  <div
                    className={`w-fit max-w-[50%] break-words ${message.role === 'user' ? 'bg-main text-white' : 'bg-white text-black'} rounded-lg p-5`}
                  >
                    {message.role === 'assistant' && <Markdown>{message.content}</Markdown>}
                    {message.role === 'user' && message.content}
                  </div>
                </div>
                <div
                  className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'} text-xs font-medium text-grey-2`}
                >
                  {dayjs(new Date(message.sentAt)).format('h:mm a')}
                </div>
              </React.Fragment>
            ))}
            {isLoading && (
              <div className='w-fit max-w-[50%] items-center justify-center bg-white p-5'>
                <Spinner color='black' size={24} />
              </div>
            )}
            {messages.length === 1 && (
              <div className='flex h-fit w-full justify-end'>
                <div className='flex w-full max-w-[40%] flex-col gap-3'>
                  <div>Choose your answer</div>
                  <form onSubmit={handleSubmit} className='flex w-fit justify-between gap-3'>
                    <Button
                      btnType='submit'
                      type='primary'
                      className='bg-main-dark transition-colors duration-300 hover:bg-main'
                      onClick={() => setInputValue('Find a doctor')}
                    >
                      Find a doctor
                    </Button>
                    <Button
                      btnType='submit'
                      type='primary'
                      className='bg-main-dark transition-colors duration-300 hover:bg-main'
                      onClick={() => setInputValue('Analyze symptoms')}
                    >
                      Analyze symptoms
                    </Button>
                    <Button
                      btnType='submit'
                      type='primary'
                      className='bg-main-dark transition-colors duration-300 hover:bg-main'
                      onClick={() => setInputValue('Book an appointment')}
                    >
                      Book an appointment
                    </Button>
                  </form>
                </div>
              </div>
            )}
            {messages && lastMessage && Array.isArray(lastMessage.doctors) && (
              <div className='grid w-full grid-cols-2 gap-4'>
                {lastMessage.doctors.map(doctor => {
                  return <DoctorCard key={doctor.id} doctor={doctor} />;
                })}
              </div>
            )}
          </>
        )}
        {isLoading && messages.length === 0 && (
          <div className='w-fit max-w-[50%] items-center justify-center bg-white p-5'>
            <Spinner color='black' size={24} />
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className='flex h-fit w-full grow'>
        <div className='flex w-full items-center justify-between bg-white p-8'>
          <div className='flex w-full gap-2 text-grey-2'>
            <Icon variant='attach' />
            <textarea
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              rows={1}
              placeholder='Write a message...'
              className='w-full resize-none outline-none'
            />
          </div>
          <Button
            type='primary'
            btnType='submit'
            disabled={isLoading || inputValue === ''}
            className={`w-fit min-w-[none] ${isLoading || inputValue === '' ? 'cursor-pointer' : ''} rounded-lg bg-main p-2`}
          >
            <Icon className='text-white' variant='send-message' />
          </Button>
        </div>
      </form>
    </div>
  );
}
