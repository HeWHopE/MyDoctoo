import { Module } from '@nestjs/common';
import { VideoSignalingGateway } from './video-signaling.gateway';
import { SocketModule } from 'src/socket/socket.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { AppointmentModule } from 'src/appointment/appointment.module';
import { DoctorModule } from 'src/doctor/doctor.module';
import { PatientModule } from 'src/patient/patient.module';

@Module({
  imports: [SocketModule, AuthModule, UserModule, AppointmentModule, DoctorModule, PatientModule],
  providers: [VideoSignalingGateway],
})
export class VideoSignalingModule {}
