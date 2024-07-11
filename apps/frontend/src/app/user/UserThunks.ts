import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';
import { setUserPasswordExist, setUserState } from './UserSlice';

export const logoutThunk = createAsyncThunk('logout', async (_void, { dispatch }) => {
  const { error } = await api.GET('/auth/logout');
  if (error) throw new Error('Failed to logout');
  dispatch(setUserState({ isFetched: false }));
});

export const isPasswordExistThunk = createAsyncThunk('isPasswordExist', async (_void, { dispatch }) => {
  const { data, error } = await api.GET('/auth/get/me/pass');
  if (error) throw new Error('Failed to check password existance');
  dispatch(setUserPasswordExist(data));
});
