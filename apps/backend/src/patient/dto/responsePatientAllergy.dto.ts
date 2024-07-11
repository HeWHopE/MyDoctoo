import { ApiProperty } from '@nestjs/swagger';

export class ResponsePatientAllergyDto {
  @ApiProperty({ example: 1, description: 'How many allergies created for patient.' })
  count: number;
}
