import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseCondtionDto {
  @ApiProperty({ example: '1', description: 'Condition id' })
  @IsString()
  readonly id: string;

  @ApiProperty({ example: 'Asthma', description: 'Condition name' })
  @IsString()
  readonly name: string;
}
