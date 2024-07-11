import { ApiProperty } from '@nestjs/swagger';

export class ResponseReviewDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique rating id.' })
  id: string;

  @ApiProperty({ example: 4, description: 'The rate in review.' })
  rate: number;

  @ApiProperty({ example: 'Experienced doctor with a focus on patient care.', description: 'Text in review.' })
  text: string | null;

  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'Unique doctor id.' })
  doctorId: string;

  @ApiProperty({ example: '2024-04-30T15:06:19.140Z', description: 'The date when the review was created.' })
  createdAt: Date;

  @ApiProperty({ example: '2024-04-30T15:06:19.140Z', description: 'The date when the review was updated.' })
  updatedAt: Date;
}
