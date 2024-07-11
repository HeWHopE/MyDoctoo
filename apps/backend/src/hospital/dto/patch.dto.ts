import { PartialType } from '@nestjs/swagger';
import { CreateHospitalDto } from './create.dto';

export class PatchHospitalDto extends PartialType(CreateHospitalDto) {}
