import { OmitType } from '@nestjs/swagger';
import { CreatePatientDto } from '../../patient/dto/create.dto';

export class SignUpPatientDto extends OmitType(CreatePatientDto, ['userId']) {}
