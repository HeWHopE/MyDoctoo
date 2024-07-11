import { PartialType } from '@nestjs/swagger';
import { CreateAppointmentDto } from './create.dto';

export class PatchAppointmentDto extends PartialType(CreateAppointmentDto) {}
