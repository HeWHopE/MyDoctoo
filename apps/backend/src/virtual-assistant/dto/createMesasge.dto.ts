import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ description: 'The content of the user`s message', example: 'Hello, I`d like to book an appointment' })
  @IsString()
  readonly content: string;
}
