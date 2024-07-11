import { ApiProperty } from '@nestjs/swagger';

export class UpdateDoctorScheduleDto {
  @ApiProperty({ example: 9, description: 'Hour in UTC the doctor starts working from.' })
  readonly startsWorkHourUTC?: number;

  @ApiProperty({ example: 20, description: 'Hour in UTC the doctor works until.' })
  readonly endsWorkHourUTC?: number;
}
