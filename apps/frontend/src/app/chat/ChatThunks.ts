import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '@/api/axios.api';
import handleError from '@/api/handleError.api';
import {
  addMessage,
  openChat,
  setChatAttachments,
  setChatMessages,
  setChats,
  setNewChat,
  setSearchedChats,
} from './ChatSlice';

export const getChats = createAsyncThunk(
  'chat/fetchChats',
  async ({ skip = 0, take = 10 }: { skip?: number; take?: number }, { dispatch }) => {
    try {
      const response = await instance.get(`/chat?skip=${skip}&take=${take}`);
      if (response.status === 200) {
        dispatch(setChats({ chats: response.data, skip }));
      }
    } catch (e) {
      handleError(e as Error);
    }
  },
);

export const searchChats = createAsyncThunk('chat/searchChats', async (q: string, { dispatch }) => {
  try {
    const response = await instance.get(`/chat/search?q=${q}`);
    if (response.status === 200) {
      dispatch(setSearchedChats(response.data));
    }
  } catch (e) {
    handleError(e as Error);
  }
});

export const getChat = createAsyncThunk('chat/fetchChat', async (chatId: string, { dispatch }) => {
  try {
    const response = await instance.get(`/chat/${chatId}`);
    if (response.status === 200) {
      dispatch(openChat(response.data));
    }
  } catch (e) {
    handleError(e as Error);
  }
});

export const fetchReadMessages = createAsyncThunk('chat/readMessages', async (chatId: string) => {
  try {
    await instance.patch(`/chat/${chatId}/read-messages`);
  } catch (e) {
    handleError(e as Error);
  }
});

export const getChatMessages = createAsyncThunk(
  'chat/fetchMessages',
  async ({ chatId, skip = 0, take = 10 }: { chatId: string; skip?: number; take?: number }, { dispatch }) => {
    try {
      const response = await instance.get(`/chat/${chatId}/messages?skip=${skip}&take=${take}`);
      if (response.status === 200) {
        dispatch(setChatMessages({ messages: response.data, skip }));
      }
    } catch (e) {
      handleError(e as Error);
    }
  },
);

export const createChat = createAsyncThunk('chat/createChat', async (createChatData, { dispatch }) => {
  try {
    const response = await instance.post(`/chat`, createChatData);
    if (response.status === 200) {
      dispatch(setNewChat(response.data));
    }
  } catch (e) {
    handleError(e as Error);
  }
});

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, messageData }: { chatId: string; messageData: FormData }, { dispatch }) => {
    try {
      const response = await instance.post(`/chat/${chatId}/messages`, messageData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 200) {
        dispatch(addMessage(response.data));
      }
    } catch (e) {
      handleError(e as Error);
    }
  },
);

export const getChatAttachments = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, skip = 0, take = 10 }: { chatId: string; skip?: number; take?: number }, { dispatch }) => {
    try {
      const response = await instance.get(`/chat/${chatId}/attachments?skip=${skip}&take=${take}`);
      if (response.status === 200) {
        dispatch(setChatAttachments({ attachments: response.data, skip }));
      }
    } catch (e) {
      handleError(e as Error);
    }
  },
);
