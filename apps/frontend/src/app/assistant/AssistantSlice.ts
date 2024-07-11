import type { TAssistantMessage } from '@/dataTypes/AssistantMessages';
import { createAppSlice } from '../createAppSlice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

type AssistantData = {
  data: TAssistantMessage[];
  isLoading: boolean;
};

const initialState: AssistantData = {
  data: [],
  isLoading: false,
};

export const assistantSlice = createAppSlice({
  name: 'assistant',
  initialState,
  reducers: {
    setAssistantMessages: (state, action: PayloadAction<TAssistantMessage[]>) => {
      state.data = action.payload;
    },
    pushAssistantMessage: (state, action: PayloadAction<TAssistantMessage>) => {
      state.data.push(action.payload);
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setAssistantMessages, pushAssistantMessage, setIsLoading } = assistantSlice.actions;

export const assistantData = (state: RootState) => state.assistant.data;

export default assistantSlice.reducer;
