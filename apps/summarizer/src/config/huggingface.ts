import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validate } from './utils';
import { Expose } from 'class-transformer';

export class HFConfig {
  @Expose()
  @IsString()
  HF_TOKEN: string;

  @Expose()
  @IsString()
  HF_MODEL_NAME: string;
}

export default registerAs('huggingface', () => {
  return validate(HFConfig);
});
