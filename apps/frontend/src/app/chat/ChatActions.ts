import type { Dispatch } from '@reduxjs/toolkit';
import { addMessage, readMessages, setNewChat, updateMessage } from './ChatSlice';
import type { Socket } from 'socket.io-client';
import type { TChat, TMessage } from '@/dataTypes/Chat';

export const handleNewChat = (socket: Socket) => (dispatch: Dispatch) => {
  socket.on('chat.created', (chat: TChat) => {
    dispatch(setNewChat(chat));
  });
};

export const handleMessages = (socket: Socket, chats: TChat[]) => (dispatch: Dispatch) => {
  chats.forEach(chat => {
    socket.on(`chat.${chat.id}.add-message`, (payload: TMessage) => {
      dispatch(addMessage(payload));
    });
    socket.on(`chat.${chat.id}.update-message`, (payload: TMessage) => {
      dispatch(updateMessage(payload));
    });
    socket.on(`chat.${chat.id}.read-messages`, (payload: any) => {
      dispatch(readMessages(payload));
    });
  });
};
