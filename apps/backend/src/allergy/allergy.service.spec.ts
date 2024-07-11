import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AllergyService } from './allergy.service';
import { CreateAllergyDto } from './dto/create.dto';
import { UpdateAllergyDto } from './dto/update.dto';

describe('AllergyService', () => {
  let allergyService: AllergyService;
  let prisma: PrismaService;

  const allergyDto: CreateAllergyDto = { name: 'test' };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ providers: [AllergyService, PrismaService] }).compile();

    allergyService = moduleRef.get<AllergyService>(AllergyService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.allergy.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should be defined', () => {
    expect(allergyService).toBeDefined();
  });

  it('should create allergy', async () => {
    const createdCondtion = await allergyService.createAllergy(allergyDto);

    expect(createdCondtion).toMatchObject(allergyDto);
    expect(createdCondtion.id).toBeDefined();
  });

  it('should return allergy by id', async () => {
    const { id } = await prisma.allergy.create({ data: allergyDto });

    const allergy = await allergyService.getAllergy(id);

    expect(allergy).toMatchObject({ ...allergyDto, id });
  });

  it('should update allergy', async () => {
    const { id } = await prisma.allergy.create({ data: allergyDto });

    const data: UpdateAllergyDto = { name: 'test-updated' };

    const updatedAllergy = await allergyService.patchAllergy(id, data);

    expect(updatedAllergy).toMatchObject({ ...allergyDto, ...data, id });
  });

  it('should remove allergy', async () => {
    const { id } = await prisma.allergy.create({ data: allergyDto });

    const removedAllergy = await allergyService.deleteAllergy(id);

    expect(removedAllergy).toBeUndefined();
  });
});
