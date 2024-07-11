import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '@prisma/client';
import { IsEnum, IsISO8601, IsOptional, IsUUID } from 'class-validator';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class CreateAppointmentDto {
  // @IsUUID(4)
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  @IsNotEmptyString()
  readonly doctorId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique patient id.' })
  // @IsUUID(4)
  @IsNotEmptyString()
  readonly patientId: string;

  @ApiProperty({ example: '2024-04-30T15:06:19.140Z', description: 'The date when appointment was created' })
  @IsNotEmptyString()
  @IsISO8601({ strict: true })
  @IsOptional()
  createdAt?: string;

  @ApiProperty({
    enum: AppointmentStatus,
    example: AppointmentStatus.PLANNED,
    description: 'Current status of the appointment.',
  })
  @IsEnum(AppointmentStatus)
  readonly status: AppointmentStatus;

  @ApiPropertyOptional({
    example: 'Get some blood pressure pills.',
    description: 'Additional comments left by the patient or doctor.',
  })
  @IsOptional()
  @IsNotEmptyString()
  readonly notes?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique Id of the billed payment.',
  })
  @IsOptional()
  @IsNotEmptyString()
  @IsUUID(4)
  readonly paymentInvoiceKey?: string;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique id of the payment receipt.',
  })
  @IsOptional()
  @IsNotEmptyString()
  @IsUUID(4)
  readonly paymentReceiptKey?: string;

  @ApiProperty({ description: 'The date and time the appointment started' })
  @IsISO8601({ strict: true })
  @IsNotEmptyString()
  readonly startedAt: string;

  @ApiPropertyOptional({ description: 'The date and time the appointment ended' })
  @IsOptional()
  @IsISO8601({ strict: true })
  @IsNotEmptyString()
  readonly endedAt?: string;
}
