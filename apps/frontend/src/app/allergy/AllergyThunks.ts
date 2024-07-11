import { createAsyncThunk } from '@reduxjs/toolkit';
import { setAllergyData } from './AllergySlice';
import api from '../api';

export const getAllAllergies = createAsyncThunk('allergy', async (_, { dispatch }) => {
  const { data, error } = await api.GET('/allergy');

  if (error) {
    throw new Error('Failed to fetch allergies');
  }

  dispatch(setAllergyData(data));
});
