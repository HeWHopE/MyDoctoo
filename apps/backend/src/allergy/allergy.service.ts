import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAllergyDto } from './dto/create.dto';
import { ResponseAllergyDto } from './dto/response.dto';
import { UpdateAllergyDto } from './dto/update.dto';

@Injectable()
export class AllergyService {
  constructor(private prismaService: PrismaService) {}

  private async isAllergyExist(id: string): Promise<boolean> {
    const allergy = await this.prismaService.allergy.findUnique({ where: { id } });

    if (!allergy) throw new NotFoundException('An allergy with this Id not found.');

    return true;
  }

  async createAllergy(body: CreateAllergyDto): Promise<ResponseAllergyDto> {
    const allergy = await this.prismaService.allergy.create({ data: body });

    return plainToInstance(ResponseAllergyDto, allergy);
  }

  async getAllergies(): Promise<ResponseAllergyDto[]> {
    const allergies = await this.prismaService.allergy.findMany();

    return plainToInstance(ResponseAllergyDto, allergies);
  }

  async getAllergy(id: string): Promise<ResponseAllergyDto> {
    await this.isAllergyExist(id);

    const allergy = this.prismaService.allergy.findUnique({ where: { id } });

    return plainToInstance(ResponseAllergyDto, allergy);
  }

  async patchAllergy(id: string, body: UpdateAllergyDto): Promise<ResponseAllergyDto> {
    await this.isAllergyExist(id);

    const allergy = this.prismaService.allergy.update({ where: { id }, data: body });

    return plainToInstance(ResponseAllergyDto, allergy);
  }

  async getAllergiesByPatiendId(patientId: string): Promise<ResponseAllergyDto[]> {
    const allergies = await this.prismaService.patientAllergy.findMany({
      where: { patientId },
      select: { allergy: { select: { id: true, name: true } } },
    });

    return plainToInstance(ResponseAllergyDto, allergies);
  }

  async deleteAllergy(id: string): Promise<void> {
    await this.isAllergyExist(id);

    await this.prismaService.allergy.delete({ where: { id } });
  }
}
