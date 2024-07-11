import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class LocalLoginDto {
  @ApiProperty({ example: 'example@example.com', description: 'Unique user mail.' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password', description: 'User password.' })
  @IsNotEmptyString()
  password: string;
}
