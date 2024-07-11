import { createReducer, on } from '@ngrx/store';
import { fetchPatientSuccess } from './patient.actions';
import { BloodType, Gender, IPatient } from '../../data-types/patient-types';

export interface PatientState {
  currentPatient: IPatient;
}

export const initialState: PatientState = {
  currentPatient: {
    id: '',
    userId: 'id',
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    avatarKey: '',
    weight: 0,
    height: 0,
    age: 0,
    bloodType: BloodType.AB_MINUS,
    gender: Gender.MALE,
    country: '',
    city: '',
    street: '',
    apartment: '',
    zipCode: 0,
    allergies: [],
    conditions: [],
    identityCardKey: '',
  },
};

export const patientReducer = createReducer(
  initialState,
  on(fetchPatientSuccess, (state, { currentPatient }) => {
    return {
      ...state,
      currentPatient,
    };
  })
);
