import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { GlobalJwtModule } from '../jwt/jwt.module';
import { ConfigModule, ConfigType } from '@nestjs/config';
import rabbitmq from '../config/rabbitmq';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MAILER_QUEUE_NAME } from '../utils/constants';

@Module({
  imports: [GlobalJwtModule, ConfigModule],
  controllers: [UserController],
  providers: [
    UserService,
    PrismaService,
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
  exports: [UserService],
})
export class UserModule {}
