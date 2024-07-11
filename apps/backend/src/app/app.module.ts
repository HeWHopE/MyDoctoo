import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AllergyModule } from '../allergy/allergy.module';
import { AppLoggerModule } from '../app-logger/logger.module';
import { ConditionModule } from '../condition/condition.module';
import { AppointmentModule } from '../appointment/appointment.module';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import auth from '../config/auth';
import config from '../config/config';
import mail from '../config/mail';
import { DeclarationModule } from '../declaration/declaration.module';
import { DoctorModule } from '../doctor/doctor.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { FileModule } from '../file/file.module';
import { HospitalModule } from '../hospital/hospital.module';
import { MinioService } from '../minio/minio.service';
import { NotificationModule } from '../notification/notification.module';
import { PatientModule } from '../patient/patient.module';
import { PaymentModule } from '../payment/payment.module';
import { ReviewModule } from '../review/review.module';
import { SpecializationModule } from '../specialization/specialization.module';
import { UserModule } from '../user/user.module';
import { FhirModule } from '../fhir/fhir.module';
import { VirtualAssistantModule } from 'src/virtual-assistant/virtual-assistant.module';
import { VideoSignalingModule } from '../video-signaling/video-signaling.module';
import rabbitmq from '../config/rabbitmq';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [auth, config, mail, rabbitmq] }),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    FavoriteModule,
    DoctorModule,
    PatientModule,
    FileModule,
    HospitalModule,
    AppointmentModule,
    DeclarationModule,
    SpecializationModule,
    ReviewModule,
    ConditionModule,
    AllergyModule,
    PaymentModule,
    ChatModule,
    AppLoggerModule,
    NotificationModule,
    FhirModule,
    VirtualAssistantModule,
    VideoSignalingModule,
  ],
  providers: [MinioService],
})
export class AppModule {}
