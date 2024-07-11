import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { NotificationAction, NotificationModel } from '@prisma/client';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  patientId: string;

  @IsOptional()
  @IsString()
  doctorId?: string;

  @IsNotEmpty()
  @IsString()
  modelId: string;

  @IsEnum(NotificationModel)
  model: NotificationModel;

  @IsEnum(NotificationAction)
  action: NotificationAction;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  fileKey?: string;
}
