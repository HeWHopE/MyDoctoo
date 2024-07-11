import { createAction, props } from '@ngrx/store';
import { IDoctor } from '../../data-types/doctor-types';

export const fetchAllDoctors = createAction('[Doctor] Fetch Doctors');

export const fetchAllDoctorsSuccess = createAction('[Doctor] Fetch Doctors Success', props<{ doctors: IDoctor[] }>());

export const fetchDoctorById = createAction('[Doctor] Fetch Doctor By Id', props<{ doctorId: string }>());

export const fetchDoctorByIdSuccess = createAction('[Doctor] Fetch Doctor By Id Success', props<{ doctor: IDoctor }>());
