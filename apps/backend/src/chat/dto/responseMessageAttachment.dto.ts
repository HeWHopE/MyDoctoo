import { ApiProperty } from '@nestjs/swagger';

export class ResponseAttachmentDto {
  @ApiProperty({ example: '349c9ffc-1427-459d-a260-1e3f186b9db2', description: 'Unique attachment id.' })
  id: string;

  @ApiProperty({ example: '349c9ffc-1427-459d-a260-1e3f186b9db2', description: 'Unique message id.' })
  messageId: string;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000.jpeg',
    description: 'The unique file id of the file in S3 storage.',
  })
  attachmentKey: string;
}

export class ResponseAttachmentArrayDto {
  @ApiProperty({ type: ResponseAttachmentDto, description: 'Array of response attachments.', isArray: true })
  attachments: ResponseAttachmentDto[];

  @ApiProperty({ type: 'number', description: 'Total number of attachments.' })
  totalAttachments: number;
}
