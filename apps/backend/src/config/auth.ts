import { registerAs } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';
import { validate } from './utils';
import { Expose } from 'class-transformer';

class AuthConfig {
  @Expose()
  @IsString()
  JWT_SECRET: string;

  @Expose()
  @IsString()
  JWT_EXPIRATION_DAYS: string;

  @Expose()
  @IsNumber()
  JWT_EXPIRATION_TRESHOLD_SECONDS: number;

  @Expose()
  @IsString()
  GOOGLE_CLIENT_ID: string;

  @Expose()
  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @Expose()
  @IsString()
  GOOGLE_REDIRECT_URL: string;

  @Expose()
  @IsNumber()
  SALT_ROUNDS: number;
}

export default registerAs('auth', () => {
  return validate(AuthConfig);
});
