import { instance } from '@/api/axios.api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  setDeleteDoctor,
  setDoctorData,
  setFamilyDoctor,
  setNewDoctor,
  setPatchDoctorData,
  setPatientDoctorData,
} from './DoctorSlice';
import type { paths } from '../../api';
import api from '../api';
import type { DoctorSchedule, DoctorStatus, IDoctor } from '../../dataTypes/Doctor';

export type GetDoctorDataPayload = {
  doctors: IDoctor[];
  count: number;
};

export type GetDoctorDataOptions = {
  search?: string;
  page?: number;
  hospitalId?: string[];
  specializationId?: string[];
  availableFrom?: string;
  availableUntil?: string;
  status?: DoctorStatus;
};

export const getDoctorData = createAsyncThunk<void, GetDoctorDataOptions | undefined>(
  'doctor',
  async (options, { dispatch }) => {
    try {
      const response = await instance.get(`/doctor`, {
        params: {
          search: options?.search,
          page: options?.page,
          hospitalId: options?.hospitalId,
          specializationId: options?.specializationId,
          availableFrom: options?.availableFrom,
          availableUntil: options?.availableUntil,
          status: options?.status,
        },
      });
      if (response.status === 200) {
        dispatch(setDoctorData(response.data));
      }
    } catch (e) {
      const error = e as Error;
      throw error;
    }
  },
);

export const getPatientDoctorData = createAsyncThunk('doctor', async (patient_id: string, { dispatch }) => {
  try {
    const { error, data } = await api.GET(`/doctor/doctors/{id}`, { params: { path: { id: patient_id } } });
    if (!error) {
      const res: paths['/doctor/doctors/{id}']['get']['responses']['200']['content']['application/json'] = data;

      dispatch(setPatientDoctorData(res));
    }
  } catch (e) {
    const error = e as Error;
    throw error;
  }
});

export const createDoctor = createAsyncThunk('doctor', async (doctor: IDoctor, { dispatch }) => {
  try {
    const response = await instance.post(`/doctor`, doctor);
    if (response.status === 201) {
      dispatch(setNewDoctor(response.data));
    }
  } catch (e) {
    const error = e as Error;
    throw error;
  }
});

export const patchDoctorData = createAsyncThunk(
  'doctor',
  async ({ id, data }: { id: string; data: Partial<IDoctor> }, { dispatch }) => {
    try {
      const response = await instance.patch(`/doctor/${id}`, data);
      if (response.status === 200) {
        dispatch(setPatchDoctorData(response.data));
      }
    } catch (e) {
      const error = e as Error;
      throw error;
    }
  },
);

export const deleteDoctor = createAsyncThunk('doctor', async (doctor_id: string, { dispatch }) => {
  try {
    const response = await instance.delete(`/doctor/${doctor_id}`);
    if (response.status === 200) {
      dispatch(setDeleteDoctor(response.data));
    }
  } catch (e) {
    const error = e as Error;
    throw error;
  }
});

export const getMyDoctorData = createAsyncThunk('doctor', async (_, { dispatch }) => {
  try {
    const { error, data } = await api.GET(`/doctor/doctors/my`, {});
    if (!error) {
      const res: paths['/doctor/doctors/my']['get']['responses']['200']['content']['application/json'] = data;

      dispatch(setPatientDoctorData(res));
    }
  } catch (e) {
    const error = e as Error;
    throw error;
  }
});

export const getFamilyDoctor = createAsyncThunk('doctor', async (doctor_id: string, { dispatch }) => {
  try {
    const response = await instance.get(`/doctor/${doctor_id}`);
    if (response.status === 200) {
      dispatch(setFamilyDoctor(response.data));
    }
  } catch (e) {
    const error = e as Error;
    throw error;
  }
});

export const addDoctorToFavorites = createAsyncThunk('favorite/added', async (doctorId: string) => {
  const response = await instance.post(`/favorite`, { doctorId });
  return response.data;
});

export const removeDoctorFromFavorites = createAsyncThunk('favorite/removed', async (doctorId: string) => {
  const response = await instance.delete(`/favorite/${doctorId}`);
  return response.data;
});

export type GetDoctorScheduleOptions = {
  doctorId: string;
  fromDate?: string | Date;
  toDate?: string | Date;
};

export const getDoctorSchedule = createAsyncThunk<DoctorSchedule, GetDoctorScheduleOptions>(
  'doctor/schedule',
  async ({ doctorId, fromDate, toDate }) => {
    const response = await instance.get(`/doctor/${doctorId}`, {
      params: {
        fromDate,
        toDate,
      },
    });
    return response.data;
  },
);
