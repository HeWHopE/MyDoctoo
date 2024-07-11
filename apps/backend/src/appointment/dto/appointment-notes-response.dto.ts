import { Expose, Transform, plainToInstance } from 'class-transformer';
import { AppointmentNotesSummaryDto } from './appointment-notes-summary.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AppointmentNotesReponseDto {
  @ApiProperty({ description: 'Clinical notes about the appointment.' })
  readonly notes: string;

  @ApiProperty({ description: 'Generated summary of the clinical notes about the appointment' })
  @Expose()
  @Transform(({ value }) => plainToInstance(AppointmentNotesSummaryDto, value))
  readonly summary: AppointmentNotesSummaryDto;
}
