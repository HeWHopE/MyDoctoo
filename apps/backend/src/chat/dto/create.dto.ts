import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export type TCreateMessage = {
  chatId: string;
  sender: Role;
  text: string;
  sentAt?: Date;
  files?: Express.Multer.File[];
};

export class CreateMessageDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Lorem ipsum text', description: 'Text message' })
  readonly text: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '2024-05-05T22:18:13.234Z', description: 'Time when sent message' })
  readonly sentAt?: Date;

  @ApiProperty({
    properties: { file: { type: 'string', format: 'binary' } },
    description: 'Array of files',
    required: false,
  })
  readonly files: Express.Multer.File[];
}

export class CreateChatDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique user id (doctor or patient).' })
  participantId: string;
}

export class CreateChatServiceDto {
  patientId: string;
  doctorId: string;
  role?: Role;
}
