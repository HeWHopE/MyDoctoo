import { PartialType } from '@nestjs/swagger';
import { CreateAllergyDto } from './create.dto';

export class UpdateAllergyDto extends PartialType(CreateAllergyDto) {}
