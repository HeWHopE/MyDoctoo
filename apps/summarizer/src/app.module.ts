import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import rabbitmq from './config/rabbitmq';
import huggingface from './config/huggingface';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [rabbitmq, huggingface] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
