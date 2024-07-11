import { Role } from '@prisma/client';
import { ResponseDoctorDto } from '../../doctor/dto/response.dto';
import { ResponsePatientDto } from '../../patient/dto/response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({})
  patient?: ResponsePatientDto;

  @ApiProperty({})
  doctor?: ResponseDoctorDto;

  @ApiProperty({ type: 'string', enum: ['PATIENT', 'DOCTOR'] })
  role: Role;
}
