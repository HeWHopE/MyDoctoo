import type { components, paths } from '@/api';
import { instance } from '@/api/axios.api';
import handleError from '@/api/handleError.api';
import type { TAllergy } from '@/dataTypes/Allergy';
import type { TCondition } from '@/dataTypes/Condition';
import { type TPatient } from '@/dataTypes/Patient';
import type { TUser } from '@/dataTypes/User';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosResponse } from 'axios';
import api from '../api';
import { addPatientAllergy, addPatientCondition, setPatientState, updatePatientData } from './PatientSlice';

export const getPatientData = createAsyncThunk('patient', async (id: string, { dispatch }) => {
  try {
    const { data, error } = await api.GET('/patient/{id}', { params: { path: { id } } });

    if (error) {
      throw new Error('Failed to fetch patient data GET /patient/:id');
    }

    dispatch(updatePatientData({ ...data }));
  } catch (e) {
    const error = e as Error;
    handleError(error);
  }
});

export const patchPatientData = createAsyncThunk(
  'patient',
  async ({ id, body }: { id: string; body: Partial<Omit<TPatient, 'userId'>> }, { dispatch }) => {
    const { data, error, response } = await api.PATCH('/patient/{id}', { params: { path: { id } }, body });
    const copy: Partial<TPatient> = Object.assign({}, data);

    if (error && response.status === 400) {
      alert((error as components['schemas']['BadRequestResponse']).errors.map(error => error.message).join(', '));

      return;
    } else if (response.status !== 200) {
      alert(error?.message || 'Something went wrong');
    } else {
      delete copy.allergies;
      delete copy.conditions;
      dispatch(updatePatientData({ ...copy }));
    }
  },
);

export const patchUserData = createAsyncThunk(
  'patient',
  async ({ userId, patientId, data }: { userId: string; data: Partial<TUser>; patientId: string }, { dispatch }) => {
    try {
      if (!data) throw new Error('Data is empty');
      const { data: responseData, error } = await api.PATCH('/user/{id}', {
        params: { path: { id: userId } },
        body: data,
      });
      if (error) {
        throw new Error('Failed to update user data PATCH /user/:id');
      }

      dispatch(updatePatientData({ ...responseData, id: patientId }));
    } catch (e) {
      const error = e as Error;
      throw error;
    }
  },
);

export const deletePatient = createAsyncThunk('patient', async (id: string) => {
  try {
    const response: AxiosResponse<string> = await instance.delete(`/patient/${id}`);
    if (response.status === 200) {
      return response.data;
    }
  } catch (e) {
    const error = e as Error;
    throw error;
  }
});

export const createPatientAllergies = createAsyncThunk(
  'patient',
  async (data: { body: TAllergy[]; id: string }, { dispatch }) => {
    try {
      dispatch(setPatientState({ isLoading: true }));

      const { data: responseData, error } = await api.POST('/patient/{id}/allergy', {
        params: { path: { id: data.id } },
        body: { allergyIds: data.body.map(({ id }) => id) },
      });

      if (error) throw new Error('Failed to create patient allergy');

      if (responseData.count === data.body.length) {
        dispatch(addPatientAllergy(data.body));
        dispatch(setPatientState({ isLoading: false, isFetched: true }));
      }
    } catch (e) {
      dispatch(setPatientState({ isLoading: false }));
      const error = e as Error;
      handleError(error);
    }
  },
);

export const changePassword = createAsyncThunk<ErrorResponseType, ChangePasswordType>('patient', async body => {
  const { error } = await api.POST('/auth/password/change', { body });
  // TODO: remove casting
  return error as ErrorResponseType;
});

export const createPatientConditions = createAsyncThunk(
  'patient',
  async (data: { body: TCondition[]; id: string }, { dispatch }) => {
    try {
      const body = { conditionIds: data.body.map(({ id }) => id) };
      dispatch(setPatientState({ isLoading: true }));
      const { data: responseData, error } = await api.POST('/patient/{id}/condition', {
        params: { path: { id: data.id } },
        body,
      });

      if (error) throw new Error('Failed to create patient allergy');
      if (responseData.count === data.body.length) {
        dispatch(addPatientCondition(data.body));
        dispatch(setPatientState({ isLoading: false, isFetched: true }));
      }
    } catch (e) {
      dispatch(setPatientState({ isLoading: false }));
      const error = e as Error;
      handleError(error);
    }
  },
);

export const uploadProfilePatientPhoto = createAsyncThunk(
  'user/uploadPatientProfilePhoto',
  async (formData: FormData) => {
    try {
      const response = await instance.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (e) {
      const error = e as Error;
      throw error;
    }
  },
);

export const deleteProfilePatientPhoto = createAsyncThunk(
  'user/deletePatientProfilePhoto',
  async (avatarKey: string) => {
    try {
      const response = await instance.delete(`/file/${avatarKey}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (e) {
      const error = e as Error;
      throw error;
    }
  },
);

export const uploadIdentityCard = createAsyncThunk(
  'patient/uploadIdentityCard',
  async ({ formData, identityCardType }: { formData: FormData; identityCardType: string }) => {
    try {
      // Append the identityCardType to the formData object
      formData.append('identityCardType', identityCardType);

      const response = await instance.post(`/file/uploadIdentityCard`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (e) {
      const error = e as Error;
      throw error;
    }
  },
);

type ChangePasswordType = paths['/auth/password/change']['post']['requestBody']['content']['application/json'];
type ErrorResponseType = components['schemas']['ClassicNestResponse'];
