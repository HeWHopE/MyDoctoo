import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PatientModule } from '../patient/patient.module';
import { UserModule } from '../user/user.module';
import { MinioModule } from '../minio/minio.module';
import { AuthModule } from '../auth/auth.module';
import { ChatGateway } from './chat.gateway';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [SocketModule, AuthModule, PatientModule, UserModule, MinioModule],
  controllers: [ChatController],
  providers: [PrismaService, ChatGateway, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
