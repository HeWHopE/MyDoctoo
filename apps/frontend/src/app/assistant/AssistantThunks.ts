import handleError from '@/api/handleError.api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import { pushAssistantMessage, setAssistantMessages, setIsLoading } from './AssistantSlice';

export const getAssistantMessages = createAsyncThunk('assistant', async (_, { dispatch }) => {
  try {
    dispatch(setIsLoading(true));
    const { data, error } = await api.GET('/virtual-assistant/get-messages');

    if (!error) {
      dispatch(setIsLoading(false));
      dispatch(setAssistantMessages(data));
    } else {
      dispatch(setIsLoading(false));
    }
  } catch (e) {
    dispatch(setIsLoading(false));
    const error = e as Error;
    handleError(error);
  }
});

export const createAssistantMessage = createAsyncThunk(
  'assistant',
  async (body: { patientId: string; content: string }, { dispatch }) => {
    try {
      dispatch(setIsLoading(true));
      const { data, error } = await api.POST('/virtual-assistant/create-message/{patientId}', {
        params: { path: { patientId: body.patientId } },
        body: { content: body.content },
      });

      if (!error) {
        dispatch(setIsLoading(false));
        dispatch(pushAssistantMessage(data));
      } else {
        dispatch(setIsLoading(false));
      }
    } catch (e) {
      dispatch(setIsLoading(false));
      const error = e as Error;
      handleError(error);
    }
  },
);

export const initializeMessages = createAsyncThunk('assistant', async (_, { dispatch }) => {
  try {
    dispatch(setIsLoading(true));
    const { data, error } = await api.GET('/virtual-assistant/initialize-conversation');
    if (!error) {
      dispatch(setIsLoading(false));
      dispatch(pushAssistantMessage(data));
    }
  } catch (e) {
    dispatch(setIsLoading(false));
    const error = e as Error;
    handleError(error);
  }
});
