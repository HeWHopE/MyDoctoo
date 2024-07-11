import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateDeclarationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  @IsUUID(4)
  readonly doctorId: string;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique patient id.' })
  @IsUUID(4)
  readonly patientId: string;
}
