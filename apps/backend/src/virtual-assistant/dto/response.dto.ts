import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { ResponseDoctorDto } from 'src/doctor/dto/response.dto';

export class ResponseAssistantChatMessageDto {
  @ApiProperty({ description: 'The unique id of the message', example: 'd290f1ee-6c54-4b01-90e6-d701748f0851' })
  @IsString()
  readonly id: string;

  @ApiProperty({ description: 'The date when the message was sent', example: '2021-08-01T12:00:00.000Z' })
  @IsDate()
  readonly sentAt: Date;

  @ApiProperty({ description: 'The role of the user who sent the message', example: 'user' })
  @Expose()
  @Transform(({ obj }) => obj.role && obj.role.toLowerCase())
  readonly role: 'user' | 'assistant';

  @ApiProperty({ description: 'The content of the message', example: 'Hello' })
  @Transform(({ obj }) =>
    Array.isArray(obj.content) ? (obj.content.length > 0 ? obj.content[0].text.value : '') : obj.content,
  )
  readonly content: string;

  @ApiProperty({
    description: 'The list of doctors',
    type: ResponseDoctorDto,
    isArray: true,
  })
  @Expose()
  @IsOptional()
  @Transform(({ obj }) => obj.doctors)
  readonly doctors?: ResponseDoctorDto[];
}
