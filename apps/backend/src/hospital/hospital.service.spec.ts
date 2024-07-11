import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CreateHospitalDto } from './dto/create.dto';
import { PatchHospitalDto } from './dto/patch.dto';
import { HospitalService } from './hospital.service';

// TODO: Check this tests more more carefully. This tests is unstable.
describe('HospitalService', () => {
  let hospitalService: HospitalService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({ providers: [HospitalService, PrismaService] }).compile();

    hospitalService = moduleRef.get<HospitalService>(HospitalService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(hospitalService).toBeDefined();
  });

  it('should create hospital', async () => {
    const hospitalDto: CreateHospitalDto = { name: 'test-hospital', city: 'test', country: 'test', street: 'test' };

    const createdHospital = await hospitalService.createHospital(hospitalDto);

    expect(createdHospital).toMatchObject(hospitalDto);
    expect(createdHospital.id).toBeDefined();
  });

  it('should return hospital by id', async () => {
    const hospitalDto: CreateHospitalDto = { name: 'test-hospital', city: 'test', country: 'test', street: 'test' };

    const { id } = await prisma.hospital.create({ data: hospitalDto });

    const hospital = await hospitalService.getHospital(id);

    expect(hospital).toMatchObject({ ...hospitalDto, id });
  });

  it('should update hospital', async () => {
    const hospitalDto: CreateHospitalDto = { name: 'test-hospital', city: 'test', country: 'test', street: 'test' };

    const { id } = await prisma.hospital.create({ data: hospitalDto });

    const delta: PatchHospitalDto = { name: 'updated-name', city: 'test', country: 'test', street: 'test' };

    const updatedHospital = await hospitalService.patchHospital(id, delta);

    expect(updatedHospital).toMatchObject({ ...hospitalDto, ...delta });
  });

  it('should delete hospital', async () => {
    const hospitalDto: CreateHospitalDto = { name: 'test-hospital', city: 'test', country: 'test', street: 'test' };

    const { id } = await prisma.hospital.create({ data: hospitalDto });

    const deleteResult = await hospitalService.deleteHospital(id);

    expect(deleteResult).toBeUndefined();
  });
});
