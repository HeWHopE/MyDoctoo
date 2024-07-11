import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';
import { LocalLoginDto } from './localLogin.dto';

export class LocalLoginTwoFactorDto extends LocalLoginDto {
  @ApiProperty({ example: '236854', description: 'One-time unique authorization code.' })
  @IsNotEmptyString()
  @Length(6, 6)
  code: string;
}
