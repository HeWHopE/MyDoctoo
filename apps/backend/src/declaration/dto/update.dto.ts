import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class UpdateDeclarationDto {
  @ApiProperty({ example: '154c3773-5130-4970-8a94-ded9a01cd0ec', description: 'Unique doctor id.' })
  @IsUUID(4)
  @IsNotEmptyString()
  readonly doctorId: string;

  @ApiProperty({ example: '154c3773-5130-4970-8a94-ded9a01cd0ec', description: 'Unique patient id.' })
  @IsUUID(4)
  @IsNotEmptyString()
  readonly patientId: string;
}
