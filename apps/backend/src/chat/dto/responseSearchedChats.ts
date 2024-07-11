import { ApiProperty } from '@nestjs/swagger';
import { ResponseChatDto, ResponseParticipantDto } from './response.dto';
import { Exclude, Expose, plainToInstance, Transform } from 'class-transformer';
import { ResponseMessageDto } from './responseMessage.dto';

export class ResponseMessagesSearchResultDto {
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
  searchedMessage: ResponseMessageDto | null;

  @ApiProperty({ example: 0, description: 'Number of missed messages by the doctor.' })
  @Expose()
  missedMessagesDoctor: number;

  @ApiProperty({ example: 0, description: 'Number of missed messages by the patient.' })
  @Expose()
  missedMessagesPatient: number;
}

export class ResponseSearchedChatsDto {
  @ApiProperty({
    description: '',
    type: ResponseMessagesSearchResultDto,
    isArray: true,
  })
  messagesSearchResults: ResponseMessagesSearchResultDto[];

  @ApiProperty({
    description: '',
    type: ResponseChatDto,
    isArray: true,
  })
  namesSearchResults: ResponseChatDto[];
}
