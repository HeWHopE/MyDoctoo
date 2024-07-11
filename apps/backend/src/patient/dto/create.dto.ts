import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BloodType, Gender } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsUUID, Max, MaxLength, Min, MinLength } from 'class-validator';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class CreatePatientDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'The unique user id of the user to which the patient is bound.',
  })
  @IsUUID(4)
  readonly userId: string;

  @ApiProperty({ example: 65, description: "Patient's weight." })
  @IsNumber()
  @Max(1000)
  @Min(30)
  readonly weight: number;

  @ApiProperty({ example: 185, description: 'Patient height.' })
  @IsNumber()
  @Max(300)
  @Min(50)
  readonly height: number;

  @ApiProperty({ example: 35, description: "Patient's age." })
  @IsNumber()
  @Max(130)
  @Min(18)
  readonly age: number;

  @ApiProperty({ enum: BloodType, example: BloodType.AB_MINUS, description: "The patient's blood type." })
  @IsEnum(BloodType)
  readonly bloodType: BloodType;

  @ApiProperty({ enum: Gender, example: Gender.MALE, description: 'Patient gender.' })
  @IsEnum(Gender)
  readonly gender: Gender;

  @ApiProperty({ example: 'USA', description: 'The country where the hospital is located.' })
  @IsNotEmptyString()
  @MaxLength(100)
  @MinLength(3)
  readonly country: string;

  @ApiPropertyOptional({ example: 'Oregon', description: 'The address of the state where the hospital is located.' })
  @IsOptional()
  @IsNotEmptyString()
  @MaxLength(50)
  @MinLength(3)
  readonly state?: string;

  @ApiProperty({ example: 'Salem', description: 'The name of the city where this hospital is located.' })
  @IsNotEmptyString()
  @MaxLength(100)
  @MinLength(3)
  readonly city: string;

  @ApiProperty({ example: 'St. Big Bells', description: 'The name of the street where this hospital is located.' })
  @IsNotEmptyString()
  @MaxLength(100)
  @MinLength(3)
  readonly street: string;

  @ApiPropertyOptional({ example: '35A', description: "Patient's apartment number." })
  @IsOptional()
  @IsNotEmptyString()
  @MinLength(1)
  readonly apartment?: string;

  @ApiPropertyOptional({ example: 0o200, description: "The hospital's zip code." })
  @IsOptional()
  @IsNumber()
  readonly zipCode?: number;
}
