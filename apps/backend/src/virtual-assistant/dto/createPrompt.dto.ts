import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePromptDto {
  @ApiProperty({ description: 'The text of the prompt', example: 'You are friendly healthcare assistant' })
  @IsString()
  readonly text: string;
}
