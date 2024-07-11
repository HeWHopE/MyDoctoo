import { ApiProperty } from '@nestjs/swagger';

export class ResponseConditionDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Condition id' })
  readonly id: string;

  @ApiProperty({ example: 'Asthma', description: 'Condition name' })
  readonly name: string;
}
