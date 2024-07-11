import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { TimeSlotAvailability } from './TimeSlotAvailability';

export class GetDoctorScheduleQuery {
  @ApiPropertyOptional({ required: false, description: 'Date to get time slots starting from.' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly from?: Date;

  @ApiPropertyOptional({ required: false, description: 'Date to get time slots ending before.' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly to?: Date;

  @ApiPropertyOptional({
    required: false,
    description: 'Used to determine which slots are needed based on their availability.',
    enum: TimeSlotAvailability,
  })
  @IsOptional()
  readonly slotAvailability?: TimeSlotAvailability;
}
