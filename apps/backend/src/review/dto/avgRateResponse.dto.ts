import { ApiProperty } from '@nestjs/swagger';

export class AvgRateResponse {
  @ApiProperty({ example: 4.5, description: 'Average rating.' })
  avg: number;

  @ApiProperty({ example: 10, description: 'Total number of reviews.' })
  count: number;
}
