import { ConfigService, registerAs } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';
import { validate } from './utils';
import { Expose } from 'class-transformer';

export class RedisConfig {
  @Expose()
  @IsString()
  REDIS_HOST: string;

  @Expose()
  @IsNumber()
  REDIS_PORT: number;

  @Expose()
  @IsString()
  REDIS_PASSWORD: string;

  @Expose()
  @IsNumber()
  CACHE_DAYS_TO_LIVE: number;
}

export default registerAs('redis', () => {
  return validate(RedisConfig);
});

const configService: ConfigService = new ConfigService();

export const configuration: RedisConfig = {
  REDIS_HOST: configService.get('REDIS_HOST'),
  REDIS_PORT: configService.get('REDIS_PORT'),
  REDIS_PASSWORD: configService.get('REDIS_PASSWORD'),
  CACHE_DAYS_TO_LIVE: configService.get('CACHE_DAYS_TO_LIVE'),
};

export const CacheModuleRegister = (store: any, config: RedisConfig = configuration) => {
  const ttl = config.CACHE_DAYS_TO_LIVE * 24 * 60 * 60; // convert days to seconds
  return {
    isGlobal: true,
    store,
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
    password: config.REDIS_PASSWORD,
    ttl,
  };
};
