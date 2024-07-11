import { ApiProperty } from '@nestjs/swagger';

export class TimeSlotDto {
  @ApiProperty({
    example: '2024-05-08T06:59:25.563Z',
    description: 'Timestamp in UTC format for the time slot.',
  })
  readonly timestamp: string;

  @ApiProperty({
    description: 'Boolean that indecates whether the time slot is available for booking or not.',
  })
  readonly available: boolean;
}
