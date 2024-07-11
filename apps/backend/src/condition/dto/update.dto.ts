import { PartialType } from '@nestjs/swagger';
import { CreateConditionDto } from './create.dto';

export class UpdateConditionDto extends PartialType(CreateConditionDto) {}
