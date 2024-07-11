import { instance } from '@/api/axios.api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { setFavorite, setNewFavorite } from './FavoriteSlice';
import api from '../api';
import handleError from '../../api/handleError.api';

export const getMyFavorites = createAsyncThunk('favorite', async (_, { dispatch }) => {
  try {
    const { data, error } = await api.GET('/favorite');

    if (error) {
      throw new Error('Failed to fetch patient data GET /patient/:id');
    }

    dispatch(setFavorite(data));
  } catch (e) {
    const error = e as Error;
    handleError(error);
  }
});

export const createFavorite = createAsyncThunk('favorite', async (doctorId: string, { dispatch }) => {
  const { data, error } = await api.POST('/favorite', { body: { doctorId } });

  if (error) {
    throw new Error('Failed to create favorite');
  }

  dispatch(setNewFavorite(data));
});

export const deleteFavorite = createAsyncThunk('favorite', async (id, { dispatch }) => {
  const response = await instance.delete(`/favorite/${id}`);

  if (response.status !== 200) {
    throw new Error('Failed to fetch favorite');
  }

  dispatch(setFavorite(response.data));
});
