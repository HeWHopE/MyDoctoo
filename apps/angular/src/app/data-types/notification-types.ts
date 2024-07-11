export enum NotificationActionEnum {
  NEW_APPOINTMENT = 'NEW_APPOINTMENT',
  CONFIRMED_APPOINTMENT = 'CONFIRMED_APPOINTMENT',
  UPCOMING_APPOINTMENT = 'UPCOMING_APPOINTMENT',
  COMPLETED_APPOINTMENT = 'COMPLETED_APPOINTMENT',
  MISSED_APPOINTMENT = 'MISSED_APPOINTMENT',
  CANCELED_APPOINTMENT = 'CANCELED_APPOINTMENT',
  FILE_RECEIVED = 'FILE_RECEIVED',
  NEW_MESSAGE = 'NEW_MESSAGE',
  INVOICE_RECEIVED = 'INVOICE_RECEIVED',
  PAYMENT_SUCCESSFUL = 'PAYMENT_SUCCESSFUL',
}

export interface INotification {
  id: string;
  action: NotificationActionEnum;
  appointment: Appointment;
  doctor: Doctor;
  createdAt: string;
  patientId: string;
  doctorId?: string;
  message: string;
  fileKey?: string;
  modelId: string;
}

export interface NotificationResponse {
  notifications: INotification[];
  totalCount: number;
}

export interface FileData {
  name: string;
  url: string;
}

interface Hospital {
  hospital: {
    id: string;
    name: string;
  };
}

interface Specialization {
  specialization: {
    id: string;
    name: string;
  };
}

interface User {
  avatarKey: string;
  firstName: string;
  lastName: string;
}

interface Doctor {
  user: User;
  hospitals: Hospital[];
  specializations: Specialization[];
  _count: {
    reviews: number;
  };
  rating: number;
}

interface Appointment {
  price: number;
  startedAt: string;
}
