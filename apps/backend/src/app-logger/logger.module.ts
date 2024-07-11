import { Module } from '@nestjs/common';
import { LoggerInterceptor } from './logger.interceptor';

@Module({
  providers: [LoggerInterceptor],
})
export class AppLoggerModule {}
