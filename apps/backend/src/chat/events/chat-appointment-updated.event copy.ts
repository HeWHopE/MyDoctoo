import { Appointment } from '@prisma/client';

export class ChatAppointmentUpdatedEvent {
  readonly appointment: Appointment;

  constructor(appointment: Appointment) {
    this.appointment = appointment;
  }
}
