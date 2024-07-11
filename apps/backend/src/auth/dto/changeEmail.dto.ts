import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty({ description: 'Token to change email, taken from email which is send when you patch user' })
  @IsString()
  token: string;
}
