import type { RootState } from '@/app/store';
import type { AppointmentStatus, IAppointment, TAppointment } from '@/dataTypes/Appointment';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';
import dayjs from 'dayjs';
import { updateAppointmentNotes } from './AppointmentThunks';

type AppointmentData = {
  appointments: IAppointment[];
  appointment?: IAppointment | null;
  currentAppointments?: TAppointment[];
  todayAppointments?: TAppointment[];
  weekAppointments?: TAppointment[];
  doctorSchedules?: {
    starts_work_hour_utc: number;
    ends_work_hour_utc: number;
  };

  isLoading: boolean;
  error: Error | null;
};

const initialState: AppointmentData = {
  appointments: [],
  appointment: null,

  currentAppointments: [],
  todayAppointments: [],
  weekAppointments: [],
  doctorSchedules: {
    starts_work_hour_utc: 8,
    ends_work_hour_utc: 15,
  },
  isLoading: false,
  error: null,
};

export const appointmentSlice = createAppSlice({
  name: 'appointment',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<IAppointment[]>) => {
      state.appointments = action.payload;
    },

    setCurrentAppointments: (state, action: PayloadAction<TAppointment[]>) => {
      state.currentAppointments = action.payload;
    },

    setTodayAppointments: (state, action: PayloadAction<TAppointment[]>) => {
      state.todayAppointments = action.payload;
    },

    setWeekAppointments: (state, action: PayloadAction<TAppointment[]>) => {
      state.weekAppointments = action.payload;
    },

    setNewAppointment: (state, action: PayloadAction<IAppointment>) => {
      state.appointments.push(action.payload);
    },

    setChangeAppointmentStatus: (state, action: PayloadAction<{ status: AppointmentStatus; id: string }>) => {
      const appointment = state.appointments.find(appointment => appointment.id === action.payload.id);
      if (appointment) {
        appointment.status = action.payload.status;
      }
    },

    setResheduleAppointment: (state, action: PayloadAction<{ id: string; newDate: string }>) => {
      const appointment = state.appointments.find(appointment => appointment.id === action.payload.id);
      if (appointment) {
        appointment.startedAt = action.payload.newDate;
        const startedAt = dayjs(appointment.startedAt);
        appointment.endedAt = startedAt.add(1, 'hour').format('YYYY-MM-DDTHH:mm:ss[Z]');
      }
    },

    setAppointment: (state, action: PayloadAction<IAppointment>) => {
      state.appointment = action.payload;
    },

    deleteAppointment: (state, action: PayloadAction<string>) => {
      state.appointments = state.appointments.filter(appointment => appointment.id !== action.payload);
    },

    resetError: state => {
      state.error = null;
    },
  },
  extraReducers: builder =>
    builder
      .addCase(updateAppointmentNotes.pending, state => {
        state.isLoading = true;
      })
      .addCase(updateAppointmentNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointment!.notes = action.payload.notes;
        state.appointment!.notesSummary = action.payload.summary;
      })
      .addCase(updateAppointmentNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error as Error;
      }),
});

export const {
  setAppointments,
  setNewAppointment,
  deleteAppointment,
  setChangeAppointmentStatus,
  setResheduleAppointment,
  setAppointment,
  setCurrentAppointments,
  setTodayAppointments,
  setWeekAppointments,
  resetError,
} = appointmentSlice.actions;

export const appointmentData = (state: RootState) => state.appointment.appointments;

export default appointmentSlice.reducer;
