import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus, AppointmentType } from '@prisma/client';
import { Expose, Transform, plainToInstance } from 'class-transformer';
import { ResponseDoctorDto } from 'src/doctor/dto/response.dto';
import { ResponsePatientDto } from 'src/patient/dto/response.dto';

export class ResponseAppointmentDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique appointment id.' })
  id: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  readonly doctorId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique patient id.' })
  patientId: string;

  @ApiProperty({ example: '2024-04-30T15:06:19.140Z', description: 'The date on which the meeting is scheduled.' })
  createdAt: Date;

  @ApiProperty({ enum: AppointmentStatus, description: 'Current status of the appointment.' })
  status: AppointmentStatus;

  @ApiProperty({
    example: 'Get some blood pressure pills.',
    description: 'Additional comments left by the patient or doctor.',
  })
  notes: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'The unique id of the billed payment.' })
  paymentInvoiceKey: string;

  @ApiProperty({ example: 50, description: 'The price of one patient`s appointment with a doctor' })
  price: number;

  @ApiProperty({ description: 'The unique id from the receipt file for the appointment.' })
  paymentReceiptKey?: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000.mp4',
    description: 'The unique id of the video chat recording.',
  })
  videoRecordKey: string;

  @ApiProperty({
    example: 'CONSULTATION',
    description: 'The type of appoinmnent.',
  })
  type: AppointmentType;

  @ApiProperty({ example: '2024-04-30T15:06:19.140Z', description: 'The time when the appointment should start.' })
  readonly startedAt: string;

  @ApiProperty({ example: '2024-04-30T15:06:19.140Z', description: 'The time when the appointment should end.' })
  readonly endedAt: string;

  @ApiProperty({ example: ResponseDoctorDto, description: 'The doctor data', required: false })
  @Expose()
  @Transform(({ value }) => plainToInstance(ResponseDoctorDto, value))
  doctor?: ResponseDoctorDto;

  @ApiProperty({ example: ResponsePatientDto, description: 'The patient data', required: false })
  @Expose()
  @Transform(({ value }) => plainToInstance(ResponsePatientDto, value))
  patient?: ResponsePatientDto;
}
