import { AppointmentStatus } from '@/dataTypes/Appointment';

export const getMeetingStatusColor = (status: string) => {
  switch (status) {
    case AppointmentStatus.PENDING_PAYMENT:
      return 'bg-grey-3';
    case AppointmentStatus.COMPLETED:
      return 'bg-main';
    case AppointmentStatus.PLANNED:
      return 'bg-orange';
    case AppointmentStatus.CANCELED:
      return 'bg-error';
    default:
      return 'bg-transparent';
  }
};
