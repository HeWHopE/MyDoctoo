import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class CreateHospitalDto {
  @ApiProperty({ example: 'Ichilov and Assuta', description: 'The full name of the hospital is.' })
  @IsNotEmptyString()
  readonly name: string;

  @ApiProperty({ example: 'USA', description: 'The country where the hospital is located.' })
  @IsNotEmptyString()
  readonly country: string;

  @ApiPropertyOptional({ example: 'Oregon', description: 'The address of the state where the hospital is located.' })
  @IsOptional()
  @IsNotEmptyString()
  readonly state?: string;

  @ApiProperty({ example: 'Salem', description: 'The name of the city where this hospital is located.' })
  @IsNotEmptyString()
  readonly city: string;

  @ApiProperty({ example: 'St. Big Bells', description: 'The name of the street where this hospital is located.' })
  @IsNotEmptyString()
  readonly street: string;

  @ApiProperty({ example: 0o200, description: "The hospital's zip code." })
  @IsNumber()
  readonly zipCode?: number;
}
