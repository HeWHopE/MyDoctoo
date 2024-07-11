import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { PatientModule } from '../patient/patient.module';
import { DoctorModule } from '../doctor/doctor.module';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigType } from '@nestjs/config';
import rabbitmq from '../config/rabbitmq';
import { SUMMARY_QUEUE_NAME } from '../utils/constants';

@Module({
  imports: [PatientModule, DoctorModule],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    PrismaService,
    {
      provide: 'SUMMARIZER_SERVICE',
      useFactory: (rabbitConfig: ConfigType<typeof rabbitmq>) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            queueOptions: {
              durable: false,
            },
            queue: SUMMARY_QUEUE_NAME,
            urls: [
              {
                hostname: rabbitConfig.RMQ_HOST,
                port: rabbitConfig.RMQ_PORT,
                username: rabbitConfig.RMQ_USERNAME,
                password: rabbitConfig.RMQ_PASSWORD,
              },
            ],
          },
        });
      },
      inject: [rabbitmq.KEY],
    },
  ],
  exports: [AppointmentService],
})
export class AppointmentModule {}
