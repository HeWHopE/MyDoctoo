import { registerAs } from '@nestjs/config';
import { validate } from './utils';
import { IsEnum, IsString } from 'class-validator';
import { PurePath } from '../validators/PurePath';
import { Expose } from 'class-transformer';

class MainConfig {
  @Expose()
  @IsEnum(['development', 'production', 'test'])
  NODE_ENV: 'development' | 'production' | 'test';

  @Expose()
  @IsString()
  APP_NAME: string;

  @Expose()
  @IsString()
  BACKEND_URL: string;

  @Expose()
  @IsString()
  FRONTEND_URL: string;

  @Expose()
  @IsString()
  @PurePath()
  FRONTEND_SIGNUP_PATH: string;

  @Expose()
  @IsString()
  @PurePath()
  FRONTEND_CHANGE_EMAIL_PATH: string;
}

export default registerAs('config', () => {
  return validate(MainConfig);
});
