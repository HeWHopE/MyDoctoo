import type { paths } from '@/api';

export enum BloodType {
  'O_PLUS' = 'O+',
  'O_MINUS' = 'O-',
  'A_PLUS' = 'A+',
  'A_MINUS' = 'A-',
  'B_PLUS' = 'B+',
  'B_MINUS' = 'B-',
  'AB_PLUS' = 'AB+',
  'AB_MINUS' = 'AB-',
}

export enum Gender {
  'MALE' = 'male',
  'FEMALE' = 'female',
}

export type TPatient = paths['/patient/{id}']['get']['responses']['200']['content']['application/json'];

export type Vaccination = {
  id: string;
  name: string;
};
