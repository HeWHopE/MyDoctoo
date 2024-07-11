import { IDoctor } from './doctor-types';
import { IPatient } from './patient-types';

export enum UserRoleEnum {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
}

export interface User {
  role: UserRoleEnum;
  patient?: IPatient;
  doctor?: IDoctor;
}
