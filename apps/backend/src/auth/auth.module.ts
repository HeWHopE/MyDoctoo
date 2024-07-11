import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { MinioModule } from 'src/minio/minio.module';
import { PatientModule } from '../patient/patient.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google';
import { JwtStrategy } from './strategies/jwt';
import { AuthRequestHelper } from './utils/cookie-helper.service';
import { GlobalJwtModule } from '../jwt/jwt.module';
import { DoctorModule } from '../doctor/doctor.module';
import rabbitmq from '../config/rabbitmq';
import { ConfigType } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MAILER_QUEUE_NAME } from '../utils/constants';

@Module({
  imports: [PassportModule, MinioModule, GlobalJwtModule, UserModule, PatientModule, DoctorModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthRequestHelper,
    GoogleStrategy,
    JwtStrategy,
    {
      provide: 'MAIL_SERVICE',
      useFactory: (rabbitConfig: ConfigType<typeof rabbitmq>) => {
        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            queueOptions: {
              durable: false,
            },
            queue: MAILER_QUEUE_NAME,
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
  exports: [AuthService],
})
export class AuthModule {}
