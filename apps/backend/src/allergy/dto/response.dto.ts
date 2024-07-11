import { ApiProperty } from '@nestjs/swagger';

export class ResponseAllergyDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique allergy id.' })
  readonly id: string;

  @ApiProperty({ example: 'Dust', description: 'Name of allergy.' })
  readonly name: string;
}
