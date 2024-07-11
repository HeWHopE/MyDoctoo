import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class CreateFhirDto {
  @ApiProperty({ example: 'https://test.fhir.org/r2', description: 'Full URL adress to FHIR server.' })
  @IsNotEmptyString()
  serverUrl: string;

  @ApiProperty({
    example: 'GXGvCIvbJcS2RgQHTIBGb4yzWD4vpreCZH3jybpxJvJDw7SFJCoDCjtVZ3e6UxUA',
    description: 'Special access token.',
  })
  @IsNotEmptyString()
  token: string;
}
