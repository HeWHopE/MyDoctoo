import { PartialType } from '@nestjs/swagger';
import { CreateSpecializationDto } from './create.dto';

export class UpdateSpecializationDto extends PartialType(CreateSpecializationDto) {}
