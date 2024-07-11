import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSpecializationDto } from './dto/create.dto';
import { UpdateSpecializationDto } from './dto/update.dto';
import { SpecializationService } from './specialization.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('SpecializationService', () => {
  let specializationService: SpecializationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [SpecializationService, PrismaService],
    }).compile();

    specializationService = module.get<SpecializationService>(SpecializationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => prisma.specialization.deleteMany());

  it('should create specialization', async () => {
    const specializationDto: CreateSpecializationDto = { name: 'test-specialization' };

    const createdSpecialization = await specializationService.createSpecialization(specializationDto);

    expect(createdSpecialization).toMatchObject(specializationDto);
    expect(createdSpecialization.id).toBeDefined();
  });

  it('should return all specializations', async () => {
    const specializationDto: CreateSpecializationDto = { name: 'test-specialization' };

    const { id } = await prisma.specialization.create({ data: specializationDto });

    const specialization = await specializationService.getSpecializations();

    expect(specialization).toMatchObject([{ ...specializationDto, id }]);
  });

  it('should return specialization by id', async () => {
    const specializationDto: CreateSpecializationDto = { name: 'test-specialization' };

    const { id } = await prisma.specialization.create({ data: specializationDto });

    const specialization = await specializationService.getSpecialization(id);

    expect(specialization).toMatchObject({ ...specializationDto, id });
  });

  it('should throw Not Found exception if specialization with given id does not exist', async () => {
    const id = 'id';

    expect(async () => specializationService.getSpecialization(id)).rejects.toThrow(NotFoundException);
  });

  it('should update specialization', async () => {
    const specializationDto: CreateSpecializationDto = { name: 'test-hospital' };

    const { id } = await prisma.specialization.create({ data: specializationDto });

    const delta: UpdateSpecializationDto = { name: 'updated-name' };

    const updatedSpecialization = await specializationService.patchSpecialization(id, delta);

    expect(updatedSpecialization).toMatchObject({ ...specializationDto, ...delta });
  });

  it('should delete specialization', async () => {
    const specializationDto: CreateSpecializationDto = { name: 'test-specialization' };

    const { id } = await prisma.specialization.create({ data: specializationDto });

    const deleteResult = await specializationService.deleteSpecialization(id);

    expect(deleteResult).toBeUndefined();
  });
});
