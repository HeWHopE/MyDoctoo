import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, Max, MaxLength, Min } from 'class-validator';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class CreateReviewDto {
  @ApiPropertyOptional({ example: 'Good doctor, recommended.', description: 'Text of the review.' })
  @IsOptional()
  @IsNotEmptyString()
  @MaxLength(2000)
  text?: string;

  @ApiPropertyOptional({ example: 5, description: 'Rate of the review.' })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(5)
  rate: number;
}
