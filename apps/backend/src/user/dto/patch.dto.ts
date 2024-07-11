import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create.dto';

export class PatchUserDto extends PartialType(CreateUserDto) {}
