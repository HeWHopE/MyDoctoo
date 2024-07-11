import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponse {
  @ApiProperty({ example: 'Unauthorized', description: 'Detailed description of the error.' })
  message: string;

  @ApiProperty({ example: 401, description: 'Error in numeric format.' })
  statusCode: number;
}
