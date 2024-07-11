import { instance } from '@/api/axios.api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getPaymentIntent = createAsyncThunk('payment', async (id: string) => {
  try {
    const response = await instance.post(`/payment/${id}`);

    return response.data.client_secret;
  } catch (e) {
    const error = e as Error;
    throw error;
  }
});

export const updatedAppointmentStatusAfterSuccessfulPayment = createAsyncThunk(
  'payment/changeAppointmentStatus',
  async (id: string) => {
    try {
      const response = await instance.post(`payment/successful/${id}`);

      return response.data;
    } catch (e) {
      const error = e as Error;
      throw error;
    }
  },
);
