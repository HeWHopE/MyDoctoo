import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { ResponseMessageDto } from './responseMessage.dto';

export class ResponseParticipantDto {
  @Exclude()
  id: string;

  @Exclude()
  userId: string;

  @Exclude()
  payrate: number;

  @Exclude()
  about: string;

  @Exclude()
  readonly rating: number;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.firstName)
  @ApiProperty({
    description: 'First name of the participant',
    example: 'John',
  })
  readonly firstName: string;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.lastName)
  @ApiProperty({
    description: 'Last name of the participant',
    example: 'Doe',
  })
  readonly lastName: string;

  @Expose()
  @Transform(({ obj }) => obj.user && obj.user.avatarKey)
  @ApiProperty({
    description: 'Key of the avatar of the participant',
    example: 'acde070d-8c4c-4f0d-9d8a-162843c10333.jpg',
  })
  readonly avatarKey: string;

  @Exclude()
  readonly phone: string;

  @Exclude()
  readonly email: string;

  @Exclude()
  readonly user: User;

  @Expose()
  @Transform(({ obj }) => obj.specializations && obj.specializations.map(s => s.specialization.name))
  @ApiProperty({
    description: 'Key of the specializations of the participant',
    example: ['Hematology'],
    required: false,
  })
  readonly specializations?: string[];
}

export class ResponseChatDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique appointment id.' })
  @Expose()
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  @Expose()
  doctorId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique patient id.' })
  @Expose()
  patientId: string;

  @ApiProperty({
    description: 'Details of the chat participant.',
    type: ResponseParticipantDto,
  })
  @Expose()
  @Transform(({ value }) => plainToInstance(ResponseParticipantDto, value))
  participant: ResponseParticipantDto;

  @Exclude()
  doctor: string;

  @Exclude()
  patient: string;

  @Exclude()
  messages: any;

  @ApiProperty({
    description: 'Details of the last message in the chat.',
    type: ResponseMessageDto,
    nullable: true,
  })
  @Expose()
  lastMessage: ResponseMessageDto | null;

  @ApiProperty({ example: 0, description: 'Number of missed messages by the doctor.' })
  @Expose()
  missedMessagesDoctor: number;

  @ApiProperty({ example: 0, description: 'Number of missed messages by the patient.' })
  @Expose()
  missedMessagesPatient: number;
}

export class ResponseChatArrayDto {
  @ApiProperty({
    description: 'Chat list',
    type: ResponseChatDto,
    isArray: true,
  })
  chats: ResponseChatDto[];

  @ApiProperty({
    example: 1,
    description: 'Total number of chats',
  })
  totalChats: number;
}
