export enum Role {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}

import type { paths } from '@/api';

export type TUser = paths['/user/{id}']['get']['responses']['200']['content']['application/json'];
