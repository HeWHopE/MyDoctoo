import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PatientService } from '../patient/patient.service';
import { AppointmentNotificationListener } from './listeners/appointment-notification.listener';
import { ChatNotificationListener } from './listeners/chat-notification.listener';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    PrismaService,
    PatientService,
    AppointmentNotificationListener,
    ChatNotificationListener,
  ],
})
export class NotificationModule {}
