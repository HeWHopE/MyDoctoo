import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeclarationDto } from './dto/create.dto';
import { ResponseDeclarationDto } from './dto/response.dto';
import { UpdateDeclarationDto } from './dto/update.dto';

@Injectable()
export class DeclarationService {
  constructor(private readonly prismaService: PrismaService) {}

  async isDeclarationByIdExists(id: number): Promise<boolean> {
    const declaration = await this.prismaService.declaration.findUnique({ where: { id } });

    if (!declaration) throw new NotFoundException('Declaration with this Id not found.');

    return true;
  }

  private async isDeclarationBetweenPatientAndDoctorExist(patientId: string, doctorId: string): Promise<boolean> {
    const declaration = await this.prismaService.declaration.findUnique({ where: { patientId, doctorId } });

    if (declaration) throw new BadRequestException('Declaration already exists.');

    return true;
  }

  private async isDoctorAndPatientExist(doctorId: string, patientId: string): Promise<boolean> {
    const doctor = await this.prismaService.doctor.findUnique({ where: { id: doctorId } });
    const patient = await this.prismaService.patient.findUnique({ where: { id: patientId } });

    if (!doctor) throw new NotFoundException('Doctor with that id not found');
    if (!patient) throw new NotFoundException('Patient with that id not found');

    return true;
  }

  private async isPatientExist(patientId: string): Promise<boolean> {
    const patient = await this.prismaService.patient.findUnique({ where: { id: patientId } });

    if (!patient) throw new NotFoundException('Patient with that id not found');

    return true;
  }

  private async isDoctorExist(doctorId: string): Promise<boolean> {
    const doctor = await this.prismaService.doctor.findUnique({ where: { id: doctorId } });

    if (!doctor) throw new NotFoundException('Doctor with that id not found');

    return true;
  }

  async createDeclaration(body: CreateDeclarationDto): Promise<ResponseDeclarationDto> {
    await this.isDoctorAndPatientExist(body.doctorId, body.patientId);
    await this.isDeclarationBetweenPatientAndDoctorExist(body.patientId, body.doctorId);

    const declaration = await this.prismaService.declaration.create({ data: body });

    return plainToInstance(ResponseDeclarationDto, declaration);
  }

  async getDeclarations(): Promise<ResponseDeclarationDto[]> {
    const declarations = await this.prismaService.declaration.findMany();

    return plainToInstance(ResponseDeclarationDto, declarations);
  }

  async getDeclaration(id: number): Promise<ResponseDeclarationDto> {
    await this.isDeclarationByIdExists(id);

    const declaration = await this.prismaService.declaration.findUnique({ where: { id } });

    return plainToInstance(ResponseDeclarationDto, declaration);
  }

  async getDeclarationByPatientId(patientId: string): Promise<ResponseDeclarationDto[]> {
    await this.isPatientExist(patientId);

    const declarations = await this.prismaService.declaration.findMany({ where: { patientId } });

    return plainToInstance(ResponseDeclarationDto, declarations);
  }

  async getDeclarationByDoctorId(doctorId: string): Promise<ResponseDeclarationDto[]> {
    await this.isDoctorExist(doctorId);

    const declarations = await this.prismaService.declaration.findMany({ where: { doctorId } });

    return plainToInstance(ResponseDeclarationDto, declarations);
  }

  async patchDeclaration(id: number, body: UpdateDeclarationDto): Promise<ResponseDeclarationDto> {
    await this.isDeclarationByIdExists(id);

    const isDeclarationBetweenPatiendAndDoctorExist = await this.prismaService.declaration.findUnique({
      where: { patientId: body.patientId, doctorId: body.doctorId },
    });

    if (isDeclarationBetweenPatiendAndDoctorExist) throw new BadRequestException('Declaration already exists.');

    const declaration = await this.prismaService.declaration.update({ where: { id }, data: body });

    return plainToInstance(ResponseDeclarationDto, declaration);
  }

  async deleteDeclaration(id: number): Promise<void> {
    await this.isDeclarationByIdExists(id);

    await this.prismaService.declaration.delete({ where: { id } });
  }
}
