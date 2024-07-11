import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID, Min, ValidateNested } from 'class-validator';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

class UpdateHospitalIdsDto {
  @IsOptional()
  @IsUUID(4, { each: true, message: 'each hospitalId in "added" should be a UUID' })
  readonly added?: string[];

  @IsOptional()
  @IsUUID(4, { each: true, message: 'each hospitalId in "deleted" should be a UUID' })
  readonly deleted?: string[];
}

class UpdateSpecializationIdsDto {
  @IsOptional()
  @IsUUID(4, { each: true, message: 'each specializationId in "added" should be a UUID' })
  readonly added?: string[];

  @IsOptional()
  @IsUUID(4, { each: true, message: 'each specializationId in "deleted" should be a UUID' })
  readonly deleted?: string[];
}

export class PatchDoctorDto {
  @ApiPropertyOptional({ description: 'The pay rate of the doctor', example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  payrate?: number;

  @ApiPropertyOptional({
    description: 'About section of the doctor',
    example: 'Experienced doctor with a focus on patient care',
  })
  @IsOptional()
  @IsNotEmptyString()
  about?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateHospitalIdsDto)
  readonly hospitalIds?: UpdateHospitalIdsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSpecializationIdsDto)
  readonly specializationIds?: UpdateSpecializationIdsDto;
}
