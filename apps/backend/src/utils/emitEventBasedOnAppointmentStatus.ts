import { AppointmentStatus } from '@prisma/client';

export const emitEventBasedOnAppointmentStatus = (eventEmitter: any, appointment: any): void => {
  const appointmentStatusToEventMap = {
    [AppointmentStatus.PENDING_PAYMENT]: 'appointment.created',
    [AppointmentStatus.PLANNED]: 'appointment.planned',
    [AppointmentStatus.COMPLETED]: 'appointment.completed',
    [AppointmentStatus.MISSED]: 'appointment.missed',
    [AppointmentStatus.CANCELED]: 'appointment.canceled',
  };

  const eventToEmit = appointmentStatusToEventMap[appointment.status];

  if (eventToEmit) {
    eventEmitter.emit(eventToEmit, {
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      appointmentId: appointment.id,
    });
  }
};
