import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create.dto';
import { IsNotEmptyString } from '../../validators/IsNotEmptyString';

export class SignUpUserDto extends OmitType(CreateUserDto, ['avatarKey']) {
  @ApiPropertyOptional({ example: 'https://imgur.com/2Bmq0jd', description: 'Link to the user image.' })
  @IsOptional()
  @IsNotEmptyString()
  avatarImgUrl?: string;
}
