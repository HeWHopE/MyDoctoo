import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus, Role } from '@prisma/client';
import { ResponseAttachmentDto } from './responseMessageAttachment.dto';
import { Exclude, Expose } from 'class-transformer';

export class ResponseMessageAppoitnment {
  @ApiProperty({ example: '349c9ffc-1427-459d-a260-1e3f186b9db2', description: 'Unique appointment id.' })
  @Expose()
  id: string;

  @ApiProperty({ example: '2024-05-02T07:41:18.065Z', description: 'Time when started appointment.' })
  @Expose()
  startedAt: string;

  @ApiProperty({ example: 'PLANNED', description: 'Appointment status.' })
  @Expose()
  status: AppointmentStatus;
}

export class ResponseMessageDto {
  @ApiProperty({ example: '349c9ffc-1427-459d-a260-1e3f186b9db2', description: 'Unique chat message id.' })
  @Expose()
  id: string;

  @ApiProperty({ example: '349c9ffc-1427-459d-a260-1e3f186b9db2', description: 'Unique chat id.' })
  @Expose()
  chatId: string;

  @ApiProperty({ example: Role.DOCTOR, description: 'Type sender.' })
  @Expose()
  sender: Role;

  @ApiProperty({ example: '2024-05-02T07:41:18.065Z', description: 'Time when sent message.' })
  @Expose()
  sentAt: Date;

  @ApiProperty({ example: 'Hello patient!', description: 'Message text' })
  @Expose()
  text: string;

  @ApiProperty({ example: '2024-05-02T07:41:18.065Z', description: 'Time when updated message.' })
  @Expose()
  editedAt: Date;

  @ApiProperty({ type: ResponseAttachmentDto, description: 'Array of attachments.', isArray: true })
  @Expose()
  attachments?: ResponseAttachmentDto[];

  @ApiProperty({
    type: ResponseMessageAppoitnment,
    example: null,
    description: 'For appointment message in chat',
    nullable: true,
  })
  @Expose()
  appointment?: ResponseMessageAppoitnment;

  @Exclude()
  appointmentId?: string;
}

export class ResponseMessageArrayDto {
  @ApiProperty({ type: ResponseMessageDto, description: 'Array of response messages.', isArray: true })
  messages: ResponseMessageDto[];

  @ApiProperty({ type: 'number', description: 'Total number of messages.' })
  totalMessages: number;
}
