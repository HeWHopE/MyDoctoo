import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateConditionDto {
  @ApiProperty({ example: 'Asthma', description: 'Condition name' })
  @IsString()
  readonly name: string;
}
