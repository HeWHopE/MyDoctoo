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

export interface IPatient {
  id: string;
  userId: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  avatarKey: string;
  weight: number;
  height: number;
  age: number;
  bloodType: BloodType;
  gender: Gender;
  country: string;
  state?: string;
  city: string;
  street: string;
  apartment?: string;
  zipCode?: number;
  allergies: string[];
  conditions: string[];
  identityCardKey: string;
  identityCardType?: string;
  requestBillPaymentApproval?: boolean;
  twoFactorAuthToggle?: boolean;
  emailNotificationToggle?: boolean;
}

export type Vaccination = {
  id: string;
  name: string;
};
