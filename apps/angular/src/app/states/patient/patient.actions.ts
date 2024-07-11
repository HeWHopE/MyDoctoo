import { createAction, props } from '@ngrx/store';
import { IPatient } from '../../data-types/patient-types';

export const fetchPatient = createAction('[Patient] Fetch Patient', props<{ patientId: string }>());

export const fetchPatientSuccess = createAction(
  '[Patient] Fetch Patient Success',
  props<{ currentPatient: IPatient }>()
);
