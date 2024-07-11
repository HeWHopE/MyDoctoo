import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseHospitalDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: "The hospital's unique id." })
  readonly id: string;

  @ApiProperty({ example: 'Ichilov and Assuta', description: 'The full name of the hospital is.' })
  readonly name: string;

  @ApiProperty({ example: 'USA', description: 'The country where the hospital is located.' })
  readonly country: string;

  @ApiPropertyOptional({ example: 'Oregon', description: 'The address of the state where the hospital is located.' })
  readonly state?: string;

  @ApiProperty({ example: 'Salem', description: 'The name of the city where this hospital is located.' })
  readonly city: string;

  @ApiProperty({ example: 'St. Big Bells', description: 'The name of the street where this hospital is located.' })
  readonly street: string;

  @ApiProperty({ example: 0o200, description: "The hospital's zip code." })
  readonly zipCode?: number;
}
