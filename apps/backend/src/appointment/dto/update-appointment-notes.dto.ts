import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAppointmentNotesDto {
  @ApiProperty({ description: 'Clinical notes about the appointment.' })
  @IsString()
  readonly notes: string;
}
