import { Expose, Transform, plainToInstance } from 'class-transformer';
import { ResponseDoctorDto } from './response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDoctorListDto {
  @ApiProperty({
    description: 'Count of records matching filters',
    example: 100,
  })
  count: number;

  @ApiProperty({
    description: 'The list of doctors',
    type: ResponseDoctorDto,
    isArray: true,
  })
  @Expose()
  @Transform(({ value }) => plainToInstance(ResponseDoctorDto, value))
  doctors: ResponseDoctorDto[];
}
