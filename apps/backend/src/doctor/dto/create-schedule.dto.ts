import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateDoctorScheduleDto {
  @ApiProperty({ example: 9, description: 'Hour in UTC the doctor starts working from.' })
  @IsNumber()
  @Type(() => Number)
  readonly startsWorkHourUTC: number;

  @ApiProperty({ example: 20, description: 'Hour in UTC the doctor until.' })
  @IsNumber()
  @Type(() => Number)
  readonly endsWorkHourUTC: number;
}
