import type { RootState } from '@/app/store';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAppSlice } from '../createAppSlice';
import type { TAllergy } from '@/dataTypes/Allergy';
import type { TCondition } from '@/dataTypes/Condition';
import type { TPatient } from '@/dataTypes/Patient';

interface PatientData {
  data: TPatient;
  state: {
    isLoading: boolean;
    isFetched: boolean;
  };
}

const initialState: PatientData = {
  state: {
    isLoading: false,
    isFetched: false,
  },
  data: {
    id: '1',
    userId: '1',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+38098555555',
    email: 'john.doe@gmail.com',
    identityCardType: '',
    avatarKey: '',
    weight: 75,
    height: 175,
    age: 75,
    bloodType: 'O_PLUS',
    gender: 'MALE',
    identityCardKey: '',
    country: '',
    state: '',
    city: '',
    street: '',
    apartment: '',
    zipCode: 0,
    conditions: [],
    allergies: [],
    emailNotificationToggle: false,
    twoFactorAuthToggle: false,
    requestBillPaymentApproval: false,
  },
};

export const patientSlice = createAppSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatientData: (state, action: PayloadAction<TPatient>) => {
      state.data = action.payload;
    },
    updatePatientData: (state, action: PayloadAction<Partial<TPatient>>) => {
      state.data = { ...state.data, ...action.payload };
    },
    addPatientAllergy: (state, action: PayloadAction<TAllergy[]>) => {
      action.payload.forEach(allergy => {
        if (state.data.allergies.some(a => a.id === allergy.id)) return;

        state.data.allergies.push(allergy);
      });
    },
    addPatientCondition: (state, action: PayloadAction<TCondition[]>) => {
      action.payload.forEach(condition => {
        if (state.data.conditions.some(a => a.id === condition.id)) return;

        state.data.conditions.push(condition);
      });
    },
    setPatientState: (state, action: PayloadAction<Partial<PatientData['state']>>) => {
      state.state = { ...state.state, ...action.payload };
    },
  },
});

export const { setPatientData, updatePatientData, setPatientState, addPatientAllergy, addPatientCondition } =
  patientSlice.actions;

export const patientData = (state: RootState) => state.patient.data;

export default patientSlice.reducer;
