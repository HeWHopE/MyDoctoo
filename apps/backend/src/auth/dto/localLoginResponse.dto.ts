import { ApiProperty } from '@nestjs/swagger';

export class LocalLoginResponseDto {
  @ApiProperty({ example: false, description: 'Whether two-factor authorization is enabled for the user.' })
  isMFAEnabled: boolean;
}
