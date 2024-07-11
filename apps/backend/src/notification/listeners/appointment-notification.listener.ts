import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationAction, NotificationModel } from '@prisma/client';
import { NotificationService } from '../notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentNotificationListener {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent('appointment.created')
  async handleAppointmentCreatedEvent(event: { patientId: string; doctorId: string; appointmentId: string }) {
    const doctorName = await this.notificationService.getDoctorName(event.doctorId);
    const appointment = await this.prismaService.appointment.findUnique({ where: { id: event.appointmentId } });

    const createNotificationDto: CreateNotificationDto = {
      patientId: event.patientId,
      doctorId: event.doctorId,
      modelId: event.appointmentId,
      model: NotificationModel.APPOINTMENT,
      message: `You received an invoice for your appointment with ${doctorName} for $${appointment.price}`,
      action: NotificationAction.NEW_APPOINTMENT,
    };

    return this.notificationService.createNotification(createNotificationDto);
  }

  @OnEvent('appointment.planned')
  async handleAppointmentPlannedEvent(event: { patientId: string; doctorId: string; appointmentId: string }) {
    const doctorName = await this.notificationService.getDoctorName(event.doctorId);
    const existingNotification = await this.prismaService.notification.findFirst({
      where: {
        action: NotificationAction.NEW_APPOINTMENT,
        modelId: event.appointmentId,
      },
    });

    if (existingNotification) {
      await this.notificationService.deleteNotification(existingNotification.id);
    }

    const createNotificationDto: CreateNotificationDto = {
      patientId: event.patientId,
      doctorId: event.doctorId,
      modelId: event.appointmentId,
      model: NotificationModel.APPOINTMENT,
      message: `Your appointment with ${doctorName} is scheduled for `,
      action: NotificationAction.CONFIRMED_APPOINTMENT,
    };

    return this.notificationService.createNotification(createNotificationDto);
  }

  @OnEvent('appointment.upcoming')
  async handleAppointmentUpcomingEvent(event: { patientId: string; doctorId: string; appointmentId: string }) {
    const doctorName = await this.notificationService.getDoctorName(event.doctorId);

    const createNotificationDto: CreateNotificationDto = {
      patientId: event.patientId,
      modelId: event.appointmentId,
      doctorId: event.doctorId,
      model: NotificationModel.APPOINTMENT,
      message: `Your appointment with ${doctorName} starts in `,
      action: NotificationAction.UPCOMING_APPOINTMENT,
    };

    return this.notificationService.createNotification(createNotificationDto);
  }

  @OnEvent('appointment.completed')
  async handleAppointmentCompletedEvent(event: { patientId: string; doctorId: string; appointmentId: string }) {
    const doctorName = await this.notificationService.getDoctorName(event.doctorId);

    const createNotificationDto: CreateNotificationDto = {
      patientId: event.patientId,
      doctorId: event.doctorId,
      modelId: event.appointmentId,
      model: NotificationModel.APPOINTMENT,
      message: `Your appointment with ${doctorName} has been completed. Thank you for your visit`,
      action: NotificationAction.COMPLETED_APPOINTMENT,
    };

    return this.notificationService.createNotification(createNotificationDto);
  }

  @OnEvent('appointment.missed')
  async handleAppointmentMissedEvent(event: { patientId: string; doctorId: string; appointmentId: string }) {
    const doctorName = await this.notificationService.getDoctorName(event.doctorId);

    const createNotificationDto: CreateNotificationDto = {
      patientId: event.patientId,
      doctorId: event.doctorId,
      modelId: event.appointmentId,
      model: NotificationModel.APPOINTMENT,
      message: `Your appointment with ${doctorName} was missed. Please book a new time`,
      action: NotificationAction.MISSED_APPOINTMENT,
    };

    return this.notificationService.createNotification(createNotificationDto);
  }

  @OnEvent('appointment.canceled')
  async handleAppointmentCanceledEvent(event: { patientId: string; doctorId: string; appointmentId: string }) {
    const doctorName = await this.notificationService.getDoctorName(event.doctorId);

    const createNotificationDto: CreateNotificationDto = {
      patientId: event.patientId,
      doctorId: event.doctorId,
      modelId: event.appointmentId,
      model: NotificationModel.APPOINTMENT,
      message: `Your appointment with ${doctorName} has been canceled`,
      action: NotificationAction.CANCELED_APPOINTMENT,
    };

    return this.notificationService.createNotification(createNotificationDto);
  }

  @OnEvent('payment.successful')
  async handlePaymentSuccessfulEvent(event: { patientId: string; doctorId: string; appointmentId: string }) {
    const doctorName = await this.notificationService.getDoctorName(event.doctorId);

    const createNotificationDto: CreateNotificationDto = {
      patientId: event.patientId,
      doctorId: event.doctorId,
      modelId: event.appointmentId,
      model: NotificationModel.APPOINTMENT,
      message: `Your appointment payment with ${doctorName} has been successfully processed`,
      action: NotificationAction.PAYMENT_SUCCESSFUL,
    };

    return this.notificationService.createNotification(createNotificationDto);
  }
}
