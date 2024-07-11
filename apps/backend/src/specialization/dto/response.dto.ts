import { ApiProperty } from '@nestjs/swagger';

export class ResponseSpecializationDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique specialisation id.' })
  readonly id: string;

  @ApiProperty({ example: 'Surgeon', description: 'Specialization name.' })
  readonly name: string;
}
