import { instance } from '@/api/axios.api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setHospital } from './HospitalSlice';

export const getAllHospitals = createAsyncThunk('hospital', async (_, { dispatch }) => {
  const response = await instance.get('/hospital');

  if (response.status !== 200) {
    throw new Error('Failed to fetch hospital');
  }

  dispatch(setHospital(response.data));
});
