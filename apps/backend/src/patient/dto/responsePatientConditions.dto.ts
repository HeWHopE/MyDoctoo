import { ApiProperty } from '@nestjs/swagger';

export class ResponsePatientConditionsDto {
  @ApiProperty({ example: 1, description: 'How many conditions created for patient.' })
  count: number;
}
