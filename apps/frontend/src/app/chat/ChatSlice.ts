import type { RootState } from '@/app/store';
import type {
  TAttachments,
  TChat,
  TChatMessagesSearchResult,
  TChats,
  TMessage,
  TMessages,
  TSearchedChats,
} from '@/dataTypes/Chat';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';

interface chatData {
  chats: TChats;
  openedChat: TChat | TChatMessagesSearchResult | null;
  isOpenedChat: boolean;
  chatMessages: TMessages;
  chatAttachedFiles: TAttachments;
  searchedChats: TSearchedChats;
}

const initialState: chatData = {
  chats: {
    chats: [],
    totalChats: 0,
  },
  openedChat: null,
  isOpenedChat: false,
  chatMessages: {
    messages: [],
    totalMessages: 0,
  },
  chatAttachedFiles: {
    attachments: [],
    totalAttachments: 0,
  },
  searchedChats: {
    messagesSearchResults: [],
    namesSearchResults: [],
  },
};

export const chatSlice = createAppSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<{ chats: TChats; skip: number }>) => {
      if (action.payload.skip === 0) {
        state.chats = action.payload.chats;
      } else {
        state.chats.totalChats = action.payload.chats.totalChats;
        state.chats.chats = [...state.chats.chats, ...action.payload.chats.chats];
      }
    },

    setNewChat: (state, action: PayloadAction<TChat>) => {
      const foundedChat = state.chats.chats.find(chat => chat.id === action.payload.id);
      if (!foundedChat) {
        state.chats = {
          chats: [action.payload, ...state.chats.chats],
          totalChats: state.chats.totalChats + 1,
        };
      }
    },

    openChat: (state, action: PayloadAction<TChat | TChatMessagesSearchResult>) => {
      if (action.payload.id !== state.openedChat?.id) {
        state.chatMessages = {
          messages: [],
          totalMessages: 0,
        };
        state.chatAttachedFiles = {
          attachments: [],
          totalAttachments: 0,
        };
      }
      state.openedChat = action.payload;
      state.isOpenedChat = true;
    },

    closeChat: state => {
      state.isOpenedChat = false;
    },

    setChatMessages: (state, action: PayloadAction<{ messages: TMessages; skip: number }>) => {
      if (action.payload.skip === 0) {
        state.chatMessages = action.payload.messages;
      } else {
        state.chatMessages.totalMessages = action.payload.messages.totalMessages;
        state.chatMessages.messages = [...state.chatMessages.messages, ...action.payload.messages.messages];
      }
    },

    addMessage: (state, action: PayloadAction<TMessage>) => {
      const foundedMessage = state.chatMessages.messages.find(message => message.id === action.payload.id);

      if (!foundedMessage && state.openedChat?.id === action.payload.chatId) {
        state.chatMessages.messages = [action.payload, ...state.chatMessages.messages];
        state.chatMessages.totalMessages = state.chatMessages.totalMessages + 1;
      }

      const chatIndex = state.chats.chats.findIndex(chat => chat.id === action.payload.chatId);
      if (chatIndex !== -1) {
        state.chats.chats[chatIndex].lastMessage = action.payload;
      }

      state.chats.chats.sort((a, b) => {
        const lastMessageA = a.lastMessage ? a.lastMessage.sentAt : new Date(0);
        const lastMessageB = b.lastMessage ? b.lastMessage.sentAt : new Date(0);
        return new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime();
      });

      if (action.payload.attachments && action.payload.attachments.length > 0) {
        action.payload.attachments.forEach(attachment => {
          const foundedAttachemt = state.chatAttachedFiles.attachments.findIndex(a => a.id === attachment.id);
          if (foundedAttachemt === -1) {
            state.chatAttachedFiles.attachments = [attachment, ...state.chatAttachedFiles.attachments];
            state.chatAttachedFiles.totalAttachments = state.chatAttachedFiles.totalAttachments + 1;
          }
        });
      }
    },

    updateMessage: (state, action: PayloadAction<TMessage>) => {
      const foundedMessageIndex = state.chatMessages.messages.findIndex(message => message.id === action.payload.id);
      if (foundedMessageIndex !== -1) {
        const updatedMessages = [
          ...state.chatMessages.messages.slice(0, foundedMessageIndex),
          action.payload,
          ...state.chatMessages.messages.slice(foundedMessageIndex + 1),
        ];

        state.chatMessages.messages = updatedMessages;
      }

      const chatIndex = state.chats.chats.findIndex(chat => chat.id === action.payload.chatId);
      if (chatIndex !== -1 && state.chats.chats[chatIndex].lastMessage?.id === action.payload.id) {
        state.chats.chats[chatIndex].lastMessage = action.payload;
      }

      state.chatAttachedFiles.attachments = state.chatAttachedFiles.attachments.filter(
        a => a.messageId !== action.payload.id,
      );
      if (action.payload.attachments && action.payload.attachments.length > 0) {
        action.payload.attachments.forEach(attachment => {
          const foundedAttachemt = state.chatAttachedFiles.attachments.findIndex(a => a.id === attachment.id);
          if (foundedAttachemt === -1) {
            state.chatAttachedFiles.attachments = [attachment, ...state.chatAttachedFiles.attachments];
            state.chatAttachedFiles.totalAttachments = state.chatAttachedFiles.totalAttachments + 1;
          }
        });
      }
    },

    setChatAttachments: (state, action: PayloadAction<{ attachments: TAttachments; skip: number }>) => {
      if (action.payload.skip === 0) {
        state.chatAttachedFiles = action.payload.attachments;
      } else {
        state.chatAttachedFiles.totalAttachments = action.payload.attachments.totalAttachments;
        action.payload.attachments.attachments.forEach(attachment => {
          const foundedAttachemt = state.chatAttachedFiles.attachments.findIndex(a => a.id === attachment.id);
          if (foundedAttachemt === -1) {
            state.chatAttachedFiles.attachments = [...state.chatAttachedFiles.attachments, attachment];
          }
        });
      }
    },

    readMessages: (state, action: PayloadAction<any>) => {
      const foundedChat = state.chats.chats.find(chat => chat.id === action.payload.chatId);
      if (foundedChat) {
        if ('missedMessagesDoctor' in action.payload) {
          foundedChat.missedMessagesDoctor = action.payload.missedMessagesDoctor;
        }
        if ('missedMessagesPatient' in action.payload) {
          foundedChat.missedMessagesPatient = action.payload.missedMessagesPatient;
        }
      }
    },

    setSearchedChats(state, action: PayloadAction<TSearchedChats>) {
      state.searchedChats = action.payload;
    },

    resetsetSearchedChats(state) {
      state.searchedChats = {
        messagesSearchResults: [],
        namesSearchResults: [],
      };
    },
  },
});

export const {
  setChats,
  setNewChat,
  openChat,
  closeChat,
  setChatMessages,
  addMessage,
  updateMessage,
  setChatAttachments,
  readMessages,
  setSearchedChats,
  resetsetSearchedChats,
} = chatSlice.actions;

export const chats = (state: RootState) => state.chat.chats;

export default chatSlice.reducer;
