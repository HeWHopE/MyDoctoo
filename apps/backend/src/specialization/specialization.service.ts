import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpecializationDto } from './dto/create.dto';
import { ResponseSpecializationDto } from './dto/response.dto';
import { UpdateSpecializationDto } from './dto/update.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { KnowledgeBaseUpdatedEvent } from 'src/virtual-assistant/events/knowledge-base-updated.event';

@Injectable()
export class SpecializationService {
  constructor(
    private prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async isSpecializationByIdExists(id: string): Promise<boolean> {
    const specialization = await this.prismaService.specialization.findUnique({ where: { id } });

    if (!specialization) throw new NotFoundException({ message: 'Specialization with this Id not found.' });

    return true;
  }

  async isSpecializationByNameExists(name: string): Promise<boolean> {
    const specialization = await this.prismaService.specialization.findFirst({
      where: { name: { mode: 'insensitive', equals: name } },
    });

    if (specialization) throw new BadRequestException({ message: 'Specialization with this name already exists.' });

    return true;
  }

  async createSpecialization(body: CreateSpecializationDto): Promise<ResponseSpecializationDto> {
    await this.isSpecializationByNameExists(body.name);

    const specialization = await this.prismaService.specialization.create({ data: body });

    this.eventEmitter.emit('knowledge.base.update', new KnowledgeBaseUpdatedEvent(process.env.OPENAI_API_ASSISTANT_ID));

    return plainToInstance(ResponseSpecializationDto, specialization);
  }

  async getSpecializations(): Promise<ResponseSpecializationDto[]> {
    const specializations = await this.prismaService.specialization.findMany();

    return plainToInstance(ResponseSpecializationDto, specializations);
  }

  async getSpecialization(id: string): Promise<ResponseSpecializationDto> {
    await this.isSpecializationByIdExists(id);

    const specialization = await this.prismaService.specialization.findUnique({ where: { id } });

    return plainToInstance(ResponseSpecializationDto, specialization);
  }

  async patchSpecialization(id: string, body: UpdateSpecializationDto): Promise<ResponseSpecializationDto> {
    await this.isSpecializationByIdExists(id);

    const specialization = await this.prismaService.specialization.update({ where: { id }, data: body });

    return plainToInstance(ResponseSpecializationDto, specialization);
  }

  async deleteSpecialization(id: string): Promise<void> {
    await this.isSpecializationByIdExists(id);

    await this.prismaService.specialization.delete({ where: { id } });
  }
}
