import { createSelector } from '@ngrx/store';
import { PatientState } from './patient.reducer';
import { AppState } from '../app.state';

export const selectPatients = (state: AppState) => state.patients;

export const selectPatient = createSelector(selectPatients, (state: PatientState) => state.currentPatient);
