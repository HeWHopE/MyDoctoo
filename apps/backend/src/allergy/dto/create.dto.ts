import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class CreateAllergyDto {
  @ApiProperty({ example: 'Dust', description: 'Name of allergy.' })
  @IsNotEmptyString()
  readonly name: string;
}
