import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestAssistantChatMessageDto {
  @ApiProperty({ description: 'The role of the user who sent the message', example: 'user' })
  @IsString()
  readonly role: 'user' | 'assistant';

  @ApiProperty({ description: 'The content of the message', example: 'Hello' })
  @IsString()
  readonly content: string;
}
