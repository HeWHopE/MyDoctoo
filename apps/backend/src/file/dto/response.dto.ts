import { ApiProperty } from '@nestjs/swagger';

const EXAMPLE_FILE_NAME = '123e4567-e89b-12d3-a456-426614174000.png';

export class ResponseFileDto {
  @ApiProperty({ example: EXAMPLE_FILE_NAME, description: 'File Name.' })
  name: string;

  @ApiProperty({
    example: `https://storage.googleapis.com/bucket/${EXAMPLE_FILE_NAME}`,
    description: 'Full link in the S3 storage to get the file.',
  })
  url: string;
}
