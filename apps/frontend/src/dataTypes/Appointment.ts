import { type components } from '../api';
import type { paths } from '@/api';
import type { IDoctor } from './Doctor';
import type { TPatient } from './Patient';

type AppointmentStatusT = components['schemas']['ResponseAppointmentDto']['status'];

export enum AppointmentStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PLANNED = 'PLANNED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  MISSED = 'MISSED',
}

// Defined to check if the real status matches the type
const _assertStatusType: { [K in AppointmentStatusT]: K } = {
  [AppointmentStatus.PENDING_PAYMENT]: AppointmentStatus.PENDING_PAYMENT,
  [AppointmentStatus.PLANNED]: AppointmentStatus.PLANNED,
  [AppointmentStatus.COMPLETED]: AppointmentStatus.COMPLETED,
  [AppointmentStatus.CANCELED]: AppointmentStatus.CANCELED,
  [AppointmentStatus.MISSED]: AppointmentStatus.MISSED,
};

export interface INotesSummaryItemPosition {
  start: number;
  end: number;
}

export interface IComplaint {
  name: string;
  position: INotesSummaryItemPosition;
}

export interface IBodyPart {
  name: string;
  position: INotesSummaryItemPosition;
}

export interface INotesSummary {
  complaints: IComplaint[];
  problematicBodyParts: IBodyPart[];
}

export interface IAppointment {
  id: string;
  doctorId: string;
  patientId: string;
  createdAt: string;
  notes: string;
  notesSummary?: INotesSummary | null;
  status?: AppointmentStatus | any;
  videoRecordKey: string;
  paymentInvoiceKey?: string;
  paymentReceiptKey?: string;
  startedAt: string;
  endedAt: string;
  doctor?: IDoctor;
  patient?: TPatient;
}

type TAppointments = paths['/appointment/my/range']['get']['responses']['200']['content']['application/json'];
export type TAppointment = TAppointments[0];

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
