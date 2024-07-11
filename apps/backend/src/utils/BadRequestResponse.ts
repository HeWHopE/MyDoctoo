import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ClassicNestResponse } from './ClassicNestResponse';

class ErrorValidationObject {
  @ApiProperty({ example: 'name', description: 'The name of the field where validation failed.' })
  property: string;

  @ApiProperty({ example: 'Name is too short', description: 'Detailed description of the error.' })
  message: string;
}

export class BadRequestResponse extends OmitType(ClassicNestResponse, ['error', 'statusCode']) {
  @ApiProperty({
    type: ErrorValidationObject,
    isArray: true,
    description: 'A list of all fields that failed validation.',
  })
  errors: ErrorValidationObject[];
}
