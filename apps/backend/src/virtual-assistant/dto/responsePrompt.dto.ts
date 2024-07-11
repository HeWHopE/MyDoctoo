import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponsePromptDto {
  @ApiProperty({ description: 'The text of the prompt', example: 'You are friendly healthcare assistant' })
  @IsString()
  readonly text: string;

  @ApiProperty({ description: 'The id of the prompt', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  readonly id: string;

  @ApiProperty({ description: 'The creation date of the prompt', example: '2022-01-01T00:00:00.000Z' })
  @IsString()
  readonly createdAt: string;
}
