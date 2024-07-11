import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';
import type { RootState } from '../store';
import type { Specialization } from '@/dataTypes/Doctor';

interface PaymentData {
  data: {
    appointmentId: string;
    status: string;
    date: string | Date;
    doctorName: string;
    doctorSpecialization: Specialization[];
    appointmentDuration: number;
    pricePerHour: number;
  };
}

const initialState: PaymentData = {
  data: {
    appointmentId: '',
    status: '',
    date: '',
    doctorName: '',
    doctorSpecialization: [{ id: '', name: '' }],
    appointmentDuration: 0,
    pricePerHour: 0,
  },
};

export const paymentSlice = createAppSlice({
  name: 'payment',
  initialState,
  reducers: {
    setPaymentData: (state, action: PayloadAction<PaymentData>) => {
      state.data = action.payload.data;
    },
  },
});

export const { setPaymentData } = paymentSlice.actions;

export const paymentData = (state: RootState) => state.payment.data;

export default paymentSlice.reducer;
