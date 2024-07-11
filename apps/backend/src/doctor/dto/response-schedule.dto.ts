import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Transform, plainToInstance } from 'class-transformer';
import { TimeSlotDto } from './time-slot.dto';

export class ResponseDoctorScheduleDto {
  @ApiProperty({ example: 9, description: 'Hour in UTC the doctor starts working from.' })
  readonly startsWorkHourUTC: number;

  @ApiProperty({ example: 20, description: 'Hour in UTC the doctor works until.' })
  readonly endsWorkHourUTC: number;

  @Transform(({ value }) => plainToInstance(TimeSlotDto, value))
  @ApiPropertyOptional({ type: TimeSlotDto, isArray: true, description: 'Time slots for doctor.' })
  readonly timeslots?: TimeSlotDto[];

  @Exclude()
  readonly doctor: any;
}
