import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreatePatientConditionDto {
  @ApiProperty({ example: ['123e4567-e89b-12d3-a456-426614174000'], description: 'Unique allergy id.' })
  @IsUUID(4, { each: true })
  readonly conditionIds: string[];
}
