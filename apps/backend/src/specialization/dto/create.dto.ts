import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class CreateSpecializationDto {
  @ApiProperty({ example: 'Surgeon', description: 'Specialization name.' })
  @IsNotEmptyString()
  readonly name: string;
}
