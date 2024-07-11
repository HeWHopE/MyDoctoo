import { ApiProperty, OmitType } from '@nestjs/swagger';
import { ResponseReviewDto } from './response.dto';

export class ResponseReviewDtoWithNames extends OmitType(ResponseReviewDto, ['createdAt', 'updatedAt']) {
  @ApiProperty({
    description: 'The names of the doctor, when icnludesName prodived.',
    required: false,
    example: { user: { firstName: 'John', lastName: 'Doe' } },
  })
  doctor?: { user: { firstName: string; lastName: string } };

  @ApiProperty({
    description: 'The names of the patient, when icnludesName provided.',
    required: false,
    example: { user: { firstName: 'John', lastName: 'Doe' } },
  })
  patient?: { user: { firstName: string; lastName: string } };
}
