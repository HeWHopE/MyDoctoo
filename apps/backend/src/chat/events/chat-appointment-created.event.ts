import { Appointment } from '@prisma/client';

export class ChatAppointmentCreatedEvent {
  readonly patientId: string;
  readonly doctorId: string;
  readonly appointment: Appointment;

  constructor(patientId: string, doctorId: string, appointment: Appointment) {
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.appointment = appointment;
  }
}
