import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class ChangePasswordDto {
  @ApiProperty({ example: 'password', description: 'Old user password.' })
  @IsNotEmptyString()
  oldPassword: string;

  @ApiProperty({ example: 'pa$$w0rd', description: 'New user password.' })
  @IsNotEmptyString()
  newPassword: string;
}
