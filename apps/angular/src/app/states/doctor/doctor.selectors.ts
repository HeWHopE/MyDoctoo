import { createSelector } from '@ngrx/store';
import { DoctorState } from './doctor.reducer';
import { AppState } from '../app.state';

export const selectDoctor = (state: AppState) => state.doctors;

export const selectDoctors = createSelector(selectDoctor, (state: DoctorState) => state.doctors);

export const selectCurrentDoctor = createSelector(selectDoctor, (state: DoctorState) => state.currentDoctor);
