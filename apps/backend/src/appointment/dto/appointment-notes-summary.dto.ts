import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Transform, plainToInstance } from 'class-transformer';

class Position {
  @ApiProperty({ description: "Starting position in the note's text" })
  readonly start: number;

  @ApiProperty({ description: "Ending position in the note's text" })
  readonly end: number;
}

class Complaint {
  @ApiProperty({ description: 'Name of the complaint' })
  readonly name: string;

  @ApiPropertyOptional({ type: Position, description: "Position of the complaint in the note's text" })
  @Expose()
  @Transform(({ value }) => value && plainToInstance(Position, value))
  readonly position?: Position;
}

class BodyPart {
  @ApiProperty({ description: 'Name of the body part' })
  readonly name: string;

  @ApiPropertyOptional({ type: Position, description: "Position of the body part in the note's text" })
  @Expose()
  @Transform(({ value }) => value && plainToInstance(Position, value))
  readonly position?: Position;
}

export class AppointmentNotesSummaryDto {
  @ApiProperty({ isArray: true, type: Complaint, description: 'List of complaints of the patient.' })
  @Expose()
  @Transform(({ value }) => plainToInstance(Complaint, value))
  complaints: Complaint[];

  @Expose()
  @Transform(({ value }) => plainToInstance(BodyPart, value))
  @ApiProperty({ isArray: true, type: BodyPart, description: 'List of problematic body parts of the patient.' })
  problematicBodyParts: BodyPart[];
}
