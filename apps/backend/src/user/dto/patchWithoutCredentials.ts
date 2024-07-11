import { OmitType } from '@nestjs/swagger';
import { PatchUserDto } from './patch.dto';

export class PatchUserWithoutCredentialsDto extends OmitType(PatchUserDto, ['password', 'googleId']) {}
