import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHospitalDto } from './dto/create.dto';
import { PatchHospitalDto } from './dto/patch.dto';
import { ResponseHospitalDto } from './dto/response.dto';

@Injectable()
export class HospitalService {
  constructor(private readonly prismaService: PrismaService) {}

  async isHospitalExists(id: string): Promise<boolean> {
    const hospital = await this.prismaService.hospital.findUnique({ where: { id } });

    if (!hospital) throw new NotFoundException({ message: 'Hospital with this Id not found.' });

    return true;
  }

  async createHospital(body: CreateHospitalDto): Promise<ResponseHospitalDto> {
    const hospital = await this.prismaService.hospital.create({ data: body });

    return plainToInstance(ResponseHospitalDto, hospital);
  }

  async getHospitals(): Promise<ResponseHospitalDto[]> {
    const hospitals = await this.prismaService.hospital.findMany();

    return plainToInstance(ResponseHospitalDto, hospitals);
  }

  async getHospital(id: string): Promise<ResponseHospitalDto> {
    await this.isHospitalExists(id);

    const hospital = await this.prismaService.hospital.findUnique({ where: { id } });

    return plainToInstance(ResponseHospitalDto, hospital);
  }

  async patchHospital(id: string, body: PatchHospitalDto): Promise<ResponseHospitalDto> {
    await this.isHospitalExists(id);

    const hospital = await this.prismaService.hospital.update({ where: { id }, data: body });

    return plainToInstance(ResponseHospitalDto, hospital);
  }

  async deleteHospital(id: string): Promise<void> {
    await this.isHospitalExists(id);

    await this.prismaService.hospital.delete({ where: { id } });
  }
}
