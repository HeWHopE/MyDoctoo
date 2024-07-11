import { createAsyncThunk } from '@reduxjs/toolkit';
import { type AxiosError } from 'axios';
import type { AppointmentStatus, IAppointment, ICreateAppointment, TAppointment } from '../../dataTypes/Appointment';
import api from '../api';
import {
  deleteAppointment,
  setAppointment,
  setAppointments,
  setChangeAppointmentStatus,
  setCurrentAppointments,
  setNewAppointment,
  setResheduleAppointment,
  setTodayAppointments,
  setWeekAppointments,
} from './AppointmentSlice';
import dayjs from 'dayjs';
import handleError from '@/api/handleError.api';
import { instance } from '@/api/axios.api';

export const getAppointmentsByPatientId = createAsyncThunk('appointment', async (patient_id: string, { dispatch }) => {
  try {
    const { error, data } = await api.GET(`/appointment/patient/{id}`, {
      params: { path: { id: patient_id } },
    });
    if (!error) {
      const res: IAppointment[] = data;

      dispatch(setAppointments(res));
    }
  } catch (e) {
    handleError(e as Error | AxiosError);
  }
});

export const getMyAppointments = createAsyncThunk('appointment', async (_, { dispatch }) => {
  try {
    const { error, data } = await api.GET(`/appointment/my`, {});
    if (!error) {
      const res: IAppointment[] = data;

      dispatch(setAppointments(res));
    }
  } catch (e) {
    handleError(e as Error | AxiosError);
  }
});

export const getMyCurrentAppointments = createAsyncThunk(
  'appointment',
  async ({ startDate, endDate }: { startDate: Date; endDate: Date }, { dispatch }) => {
    try {
      const response = await getAppointmentRange({ startDate, endDate });
      if (response.status === 200) {
        const res: TAppointment[] = response.data;
        dispatch(setCurrentAppointments(res));
      }
    } catch (e) {
      handleError(e as Error | AxiosError);
    }
  },
);

export const getMyTodayAppointments = createAsyncThunk('appointment', async (_, { dispatch }) => {
  try {
    const currentDate = new Date();
    const startDate = new Date(currentDate.setHours(0, 0, 0, 0));
    const endDate = new Date(currentDate.setHours(23, 59, 59, 999));
    const response = await getAppointmentRange({ startDate, endDate });
    if (response.status === 200) {
      const res: TAppointment[] = response.data;
      dispatch(setTodayAppointments(res));
    }
  } catch (e) {
    handleError(e as Error | AxiosError);
  }
});

export const getMyWeekAppointments = createAsyncThunk(
  'appointment',
  async ({ startDate, endDate }: { startDate: Date; endDate: Date }, { dispatch }) => {
    try {
      const response = await getAppointmentRange({ startDate, endDate });
      if (response.status === 200) {
        const res: TAppointment[] = response.data;
        dispatch(setWeekAppointments(res));
      }
    } catch (e) {
      handleError(e as Error | AxiosError);
    }
  },
);

async function getAppointmentRange({ startDate, endDate }: { startDate: Date; endDate: Date }) {
  const queryParams = new URLSearchParams();
  if (startDate) {
    queryParams.append('startDate', encodeURIComponent(startDate.toISOString()));
  }
  if (endDate) {
    queryParams.append('endDate', encodeURIComponent(endDate.toISOString()));
  }

  const response = await instance.get(`/appointment/my/range`, {
    params: {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    },
  });

  return response;
}

export const getAppointment = createAsyncThunk('appointment', async (appointment_id: string, { dispatch }) => {
  try {
    const { error, data } = await api.GET(`/appointment/{id}`, {
      params: { path: { id: appointment_id } },
    });
    if (!error) {
      const res: IAppointment = data;

      dispatch(setAppointment(res));
    }
  } catch (e) {
    handleError(e as Error | AxiosError);
  }
});

export const getLoginedDoctorAppointments = createAsyncThunk('appointment', async (_, { dispatch }) => {
  try {
    const { error, data } = await api.GET(`/appointment/doctor/all`, {});
    if (!error) {
      const res: IAppointment[] = data;

      dispatch(setAppointments(res));
    }
  } catch (e) {
    handleError(e as Error | AxiosError);
  }
});

export const createAppointment = createAsyncThunk(
  'appointment',
  async (appointment: ICreateAppointment, { dispatch }) => {
    try {
      const { error, data } = await api.POST(`/appointment`, {
        body: { ...appointment },
      });
      if (!error) {
        dispatch(setNewAppointment(data));
      }
    } catch (e) {
      handleError(e as Error | AxiosError);
    }
  },
);

export const changeAppointmentStatus = createAsyncThunk(
  'appointment',
  async (data: { id: string; status: AppointmentStatus }, { dispatch }) => {
    try {
      const { error, data: responseData } = await api.PATCH(`/appointment/{id}`, {
        params: { path: { id: data.id } },
        body: { status: data.status },
      });
      if (!error) {
        dispatch(setChangeAppointmentStatus({ id: responseData.id, status: responseData.status as AppointmentStatus }));
      }
    } catch (e) {
      handleError(e as Error | AxiosError);
    }
  },
);

export const rescheduleAppointment = createAsyncThunk(
  'appointment',
  async (request: { id: string; newDate: string }, { dispatch }) => {
    try {
      const startedAt = dayjs.utc(request.newDate);
      const endedAt = startedAt.add(1, 'hour').format('YYYY-MM-DDTHH:mm:ss[Z]');

      const { error, data } = await api.PATCH(`/appointment/{id}`, {
        params: { path: { id: request.id } },
        body: { startedAt: startedAt.format('YYYY-MM-DDTHH:mm:ss[Z]'), endedAt },
      });
      if (!error) {
        dispatch(setResheduleAppointment({ id: data.id, newDate: data.startedAt }));
      }
    } catch (e) {
      handleError(e as Error | AxiosError);
    }
  },
);

export const deleteAppointmentById = createAsyncThunk('appointment', async (appointment_id: string, { dispatch }) => {
  try {
    const { error } = await api.DELETE(`/appointment/{id}`, {
      params: { path: { id: appointment_id } },
    });
    if (!error) {
      dispatch(deleteAppointment(appointment_id));
    }
  } catch (e) {
    handleError(e as Error | AxiosError);
  }
});

export const updateAppointmentNotes = createAsyncThunk(
  'appointment/notes',
  async ({ appointmentId, notes }: { appointmentId: string; notes: string }, { rejectWithValue }) => {
    try {
      const { data } = await instance.patch(`/appointment/${appointmentId}/notes`, {
        notes,
      });
      return data;
    } catch (error) {
      return rejectWithValue(
        { message: (error as AxiosError).response?.data, code: (error as AxiosError).response?.status } || {
          message: 'Failed to fetch data',
        },
      );
    }
  },
);
