import { createReducer, on } from '@ngrx/store';
import { IDoctor } from '../../data-types/doctor-types';
import { fetchAllDoctorsSuccess, fetchDoctorByIdSuccess } from './doctor.actions';

export interface DoctorState {
  doctors: IDoctor[];
  currentDoctor: IDoctor | undefined;
}

export const initialState: DoctorState = {
  doctors: [],
  currentDoctor: undefined,
};

export const doctorReducer = createReducer(
  initialState,
  on(fetchAllDoctorsSuccess, (state, { doctors }) => {
    return {
      ...state,
      doctors,
    };
  }),
  on(fetchDoctorByIdSuccess, (state, { doctor }) => {
    return {
      ...state,
      currentDoctor: doctor,
    };
  })
);
