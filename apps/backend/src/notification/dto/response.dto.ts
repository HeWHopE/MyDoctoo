import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationAction, NotificationModel } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class ResponseNotificationDto {
  @ApiProperty({ example: '478e70e3-2de9-4b2c-b7df-eac849365210', description: 'Unique notification id.' })
  id: string;

  @ApiProperty({ example: '8834faa9-7dc6-49e6-986c-d8eb74c6188e', description: 'Unique patient id.' })
  patientId: string;

  @IsOptional()
  @ApiPropertyOptional({ example: 'c3f23c8b-b517-4a1a-964e-e232349e2824', description: 'Unique doctor id.' })
  doctorId?: string;

  @ApiProperty({
    example: '478e70e3-2de9-4b2c-b7df-eac849365210',
    description: 'Model ID associated with notification.',
  })
  modelId: string;

  @ApiProperty({ enum: NotificationModel, example: NotificationModel.APPOINTMENT, description: 'Notification model.' })
  model: NotificationModel;

  @ApiProperty({
    enum: NotificationAction,
    example: NotificationAction.NEW_APPOINTMENT,
    description: 'Notification action.',
  })
  action: NotificationAction;

  @ApiProperty({
    example: 'You received an invoice for your appointment with Dr. John Smith for $50',
    description: 'Short message for patient.',
  })
  message: string;

  @ApiPropertyOptional({ example: '123e45674fdf4v', description: 'Key for file.' })
  fileKey?: string;

  @ApiProperty({ example: '2023-05-05T14:48:00.000Z', description: 'Notification creation date.' })
  createdAt: Date;
}
