import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationAction, NotificationModel } from '@prisma/client';
import { NotificationService } from '../notification.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class ChatNotificationListener {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent('file.received')
  async handleFileReceivedEvent(event: { patientId: string; doctorId: string; fileId: string }) {
    const doctorName = await this.notificationService.getDoctorName(event.doctorId);

    const createNotificationDto: CreateNotificationDto = {
      patientId: event.patientId,
      doctorId: event.doctorId,
      modelId: event.fileId,
      model: NotificationModel.CHAT,
      message: `${doctorName} has sent you `,
      action: NotificationAction.FILE_RECEIVED,
    };

    return this.notificationService.createNotification(createNotificationDto);
  }

  @OnEvent('message.received')
  async handleNewMessageEvent(event: { patientId: string; doctorId: string; messageId: string }) {
    const doctorName = await this.notificationService.getDoctorName(event.doctorId);

    const createNotificationDto: CreateNotificationDto = {
      patientId: event.patientId,
      doctorId: event.doctorId,
      modelId: event.messageId,
      model: NotificationModel.CHAT,
      message: `${doctorName} has sent you a message`,
      action: NotificationAction.NEW_MESSAGE,
    };

    return this.notificationService.createNotification(createNotificationDto);
  }
}
