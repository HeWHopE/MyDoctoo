import { PartialType } from '@nestjs/swagger';
import { CreateReviewDto } from './create.dto';

export class PatchReviewDto extends PartialType(CreateReviewDto) {}
