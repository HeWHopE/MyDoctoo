export interface Specialization {
  id: string;
  name: string;
}

export interface Hospital {
  id: string;
  name: string;
  country: string;
  state?: string | null;
  city: string;
  street: string;
  zipCode: number;
}

export interface DoctorSchedule {
  startsWorkHourUTC: number;
  endsWorkHourUTC: number;
  unavailableTimeSlots?: string[];
}

export interface IDoctor {
  id: string;
  userId: string;
  payrate: number;
  about: string;
  firstName: string;
  lastName: string;
  avatarKey: string;
  email: string;
  phone: string;
  specializations: Specialization[];
  hospitals: Hospital[];
  rating: number;
  reviewsCount: number;
  schedule?: DoctorSchedule;
  isFavorite?: boolean;
}
