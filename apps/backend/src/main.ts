import { RedocModule } from '@brakebein/nestjs-redoc';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as swaggerStats from 'swagger-stats';
import { AppModule } from './app/app.module';
import { LoggerInterceptor } from './app-logger/logger.interceptor';
import { RedisIoAdapter } from './adapter/redis.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: errors => {
        const formattedErrors = errors.map(error => ({
          property: error.property,
          message: error.constraints[Object.keys(error.constraints)[0]],
        }));

        return new BadRequestException({ message: 'Validation failed', errors: formattedErrors });
      },
    }),
  );

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  app.enableCors({ origin: true, credentials: true });
  app.use(cookieParser());

  const configService = app.get<ConfigService>(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Docktoo API')
    .setDescription('Detailed technical documentation describing all possible API endpoints for this project.')
    .setVersion(process.env.npm_package_version)
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  app.use(swaggerStats.getMiddleware({ swaggerSpec: document }));

  app.useGlobalInterceptors(app.get(LoggerInterceptor));

  RedocModule.setup('/', app, document, {});

  await app.listen(configService.get('BACKEND_PORT'));
}

bootstrap();
