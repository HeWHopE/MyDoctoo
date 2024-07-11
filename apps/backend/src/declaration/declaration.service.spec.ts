import { Test, TestingModule } from '@nestjs/testing';
import { BloodType, Gender } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { doctorStub } from '../doctor/doctor.stub';
import { CreateDoctorDto } from '../doctor/dto/create.dto';
import { ResponseDoctorDto } from '../doctor/dto/response.dto';
import { hospitalStub } from '../hospital/hospital.stub';
import { CreatePatientDto } from '../patient/dto/create.dto';
import { patientStub } from '../patient/patient.stub';
import { PrismaService } from '../prisma/prisma.service';
import { userStub } from '../user/user.stub';
import { DeclarationService } from './declaration.service';

describe('DeclarationService', () => {
  let service: DeclarationService;
  let prisma: PrismaService;
  let testDoctor: ResponseDoctorDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeclarationService, PrismaService],
    }).compile();

    service = module.get<DeclarationService>(DeclarationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of objects', () => {
    expect(service.getDeclarations()).toMatchObject({});
  });

  it('should create a new declaration', async () => {
    const userFirst = await prisma.user.create({ data: userStub() });
    const userSecond = await prisma.user.create({ data: { ...userStub(), email: 'test2@gmail.com' } });

    const patientData: CreatePatientDto = {
      ...patientStub(),
      bloodType: BloodType.AB_PLUS,
      gender: Gender.FEMALE,
      userId: userFirst.id,
    };

    const specialization = await prisma.specialization.create({ data: { name: 'test3' } });

    const hospitalIds = await prisma.hospital.create({ data: hospitalStub() });

    const doctorData: CreateDoctorDto = {
      ...doctorStub(),
      hospitalIds: [hospitalIds.id],
      specializationIds: [specialization.id],
      userId: userSecond.id,
    };

    const patient = await prisma.patient.create({ data: patientData });
    const doctor = await prisma.doctor.create({ data: doctorData });

    const declarationData = { patientId: patient.id, doctorId: doctor.id };

    const declaration = await service.createDeclaration({ ...declarationData });

    expect(declaration).toMatchObject(declarationData);
    expect(declaration).toHaveProperty('id');
  });

  it('should return 404 for non-existent patientId', async () => {
    const user = await prisma.user.create({ data: { ...userStub(), email: 'test3@gmail.com' } });

    const doctor = await prisma.doctor.create({ data: { ...doctorStub(), userId: user.id } });

    testDoctor = plainToInstance(ResponseDoctorDto, doctor);

    const declarationData = { patientId: 'non-existent-id', doctorId: doctor.id };

    try {
      await service.createDeclaration(declarationData);
    } catch (error) {
      expect(error.status).toEqual(404);
    }
  });

  it('should return 404 for non-existent doctorId', async () => {
    const user = await prisma.user.create({ data: { ...userStub(), email: 'test4@gmail.com' } });

    const patientData: CreatePatientDto = {
      ...patientStub(),
      bloodType: BloodType.AB_PLUS,
      gender: Gender.FEMALE,
      userId: user.id,
    };

    const patient = await prisma.patient.create({ data: patientData });

    const declarationData = { patientId: patient.id, doctorId: 'non-existent-id' };

    try {
      await service.createDeclaration(declarationData);
    } catch (error) {
      expect(error.status).toEqual(404);
    }
  });

  it('should return 404 for non-existent declarationId', async () => {
    const random = Math.floor(Math.random() * 1000);

    try {
      await service.getDeclaration(random);
    } catch (error) {
      expect(error.status).toEqual(404);
    }
  });

  it('should update a declaration', async () => {
    // Create a new declaration
    const userFirst = await prisma.user.create({ data: { ...userStub(), email: 'test7@gmail.com' } });

    const userSecond = await prisma.user.create({ data: { ...userStub(), email: 'test6@gmail.com' } });

    const patientData: CreatePatientDto = {
      ...patientStub(),
      bloodType: BloodType.AB_PLUS,
      gender: Gender.FEMALE,
      userId: userFirst.id,
    };

    const specialization = await prisma.specialization.create({ data: { name: 'test3' } });

    const hospitalIds = await prisma.hospital.create({ data: hospitalStub() });

    const doctorData: CreateDoctorDto = {
      ...doctorStub(),
      hospitalIds: [hospitalIds.id],
      specializationIds: [specialization.id],
      userId: userSecond.id,
    };

    const patient = await prisma.patient.create({ data: patientData });
    const doctor = await prisma.doctor.create({ data: doctorData });

    const declarationData = { patientId: patient.id, doctorId: doctor.id };

    const createdDeclaration = await service.createDeclaration(declarationData);

    const updatedDeclaration = await service.patchDeclaration(createdDeclaration.id, {
      patientId: patient.id,
      doctorId: testDoctor.id,
    });

    expect(updatedDeclaration).toBeDefined();
  });

  it('should return status 200 for successful deletion', async () => {
    // Create users for testing
    const userFirst = await prisma.user.create({ data: { ...userStub(), email: 'test8@gmail.com' } });

    const userSecond = await prisma.user.create({ data: { ...userStub(), email: 'test9@gmail.com' } });

    const patientData: CreatePatientDto = {
      ...patientStub(),
      bloodType: BloodType.AB_PLUS,
      gender: Gender.FEMALE,
      userId: userFirst.id,
    };

    const specialization = await prisma.specialization.create({ data: { name: 'test3' } });

    const hospitalIds = await prisma.hospital.create({ data: hospitalStub() });

    const doctorData: CreateDoctorDto = {
      ...doctorStub(),
      hospitalIds: [hospitalIds.id],
      specializationIds: [specialization.id],
      userId: userSecond.id,
    };

    const patient = await prisma.patient.create({ data: patientData });
    const doctor = await prisma.doctor.create({ data: doctorData });

    const declarationData = { patientId: patient.id, doctorId: doctor.id };

    const createdDeclaration = await service.createDeclaration(declarationData);

    const declaration = await service.deleteDeclaration(createdDeclaration.id);

    expect(declaration).toBeUndefined();
  });
});
