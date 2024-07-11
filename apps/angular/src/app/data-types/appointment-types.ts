import type { IDoctor } from './doctor-types';
import type { IPatient } from './patient-types';

export enum AppointmentStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PLANNED = 'PLANNED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface IAppointment {
  id: string;
  doctorId: string;
  patientId: string;
  createdAt: string;
  notes: string;
  status?: AppointmentStatus;
  videoRecordKey: string;
  paymentInvoiceKey?: string;
  paymentReceiptKey?: string;
  startedAt: string;
  endedAt: string;
  doctor?: IDoctor;
  patient?: IPatient;
}

export interface IPlannedAppointment {
  id: string;
  createdAt: string;
  notes: string;
}

export interface ICreateAppointment {
  doctorId: string;
  patientId: string;
  createdAt: string;
  status: AppointmentStatus;
  startedAt: string;
  endedAt: string;
}
