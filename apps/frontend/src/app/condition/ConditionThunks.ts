import { createAsyncThunk } from '@reduxjs/toolkit';
import { setConditionData } from './ConditionSlice';
import handleError from '@/api/handleError.api';
import api from '../api';

export const getAllConditions = createAsyncThunk('condition', async (_, { dispatch }) => {
  try {
    const { data, error } = await api.GET('/condition');

    if (error) {
      throw new Error('Failed to fetch condition data GET /condition');
    }

    dispatch(setConditionData(data));
  } catch (e) {
    const error = e as Error;
    handleError(error);
  }
});
