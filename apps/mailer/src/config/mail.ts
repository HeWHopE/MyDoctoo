import { registerAs } from '@nestjs/config';
import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsString, Max, Min } from 'class-validator';
import { validate } from './utils';

class MailConfig {
  @Expose()
  @IsString()
  MAIL_HOST: string;

  @Expose()
  @IsNumber()
  @Min(0)
  @Max(65535)
  MAIL_PORT: number;

  @Expose()
  @IsString()
  MAIL_USER: string;

  @Expose()
  @IsString()
  MAIL_PASS: string;

  @Expose()
  @IsString()
  MAIL_FROM: string;

  @Expose()
  @Type(() => String)
  @Transform(({ value }) => {
    return value === 'true';
  })
  MAIL_SECURE: boolean;
}

export default registerAs('mail', () => {
  return validate(MailConfig);
});
