import { registerAs } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';
import { validate } from './utils';
import { Expose } from 'class-transformer';

export class RabbitMQConfig {
  @Expose()
  @IsString()
  RMQ_HOST: string;

  @Expose()
  @IsNumber()
  RMQ_PORT: number;

  @Expose()
  @IsString()
  RMQ_USERNAME: string;

  @Expose()
  @IsString()
  RMQ_PASSWORD: string;
}

export default registerAs('rabbitmq', () => {
  return validate(RabbitMQConfig);
});
