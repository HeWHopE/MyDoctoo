import { instance } from '@/api/axios.api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getSpecializationsList = createAsyncThunk('specialization', async () => {
  try {
    const response = await instance.get(`/specialization`);
    return response.data;
  } catch (e) {
    const error = e as Error;
    throw error;
  }
});
