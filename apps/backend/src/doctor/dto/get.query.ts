import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';
import { Type } from 'class-transformer';
import { StatusFilters } from './StatusFilters';

export class GetDoctorsQuery {
  @ApiPropertyOptional({ required: false, isArray: true, description: 'ID of the hospital to filter doctors by' })
  @IsOptional()
  @IsUUID(4, { each: true, message: 'hospitalId should be a UUID' })
  readonly hospitalId?: string | string[];

  @ApiPropertyOptional({ required: false, description: 'Status to filter doctors by', type: StatusFilters })
  @IsOptional()
  @IsEnum(StatusFilters)
  readonly status?: StatusFilters;

  @ApiPropertyOptional({ required: false, isArray: true, description: 'ID of the specialization to filter doctors by' })
  @IsOptional()
  @IsUUID(4, { each: true, message: 'each specializationId should be a UUID' })
  readonly specializationId?: string | string[];

  @ApiPropertyOptional({ required: false, description: 'Search string' })
  @IsOptional()
  @IsNotEmptyString()
  readonly search?: string;

  @ApiPropertyOptional({ required: false, description: 'Page number' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  readonly page?: number;

  @ApiPropertyOptional({ required: false, description: 'Items per page count' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  readonly itemsPerPage?: number;

  @ApiPropertyOptional({ required: false, description: 'Date to filter doctors by availability' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly availableFrom?: Date;

  @ApiPropertyOptional({ required: false, description: 'Date to filter doctors by availability' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  readonly availableUntil?: Date;
}
