import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { BloodType, Gender } from '@prisma/client';
import { AllergyModule } from '../allergy/allergy.module';
import { PrismaService } from '../prisma/prisma.service';
import { userStub } from '../user/user.stub';
import { CreatePatientDto } from './dto/create.dto';
import { PatchPatientDto } from './dto/patch.dto';
import { PatientService } from './patient.service';
import { patientStub } from './patient.stub';
import { UserService } from '../user/user.service';
import { mockConfigs, mockUndefined, pipe } from '../utils/test-injection-mock';

describe('PatientService', () => {
  let patientService: PatientService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AllergyModule],
      providers: [
        PatientService,
        PrismaService,
        UserService,
        PatientService,
        { provide: 'MAIL_SERVICE', useValue: { send: jest.fn(), emit: jest.fn() } },
      ],
    })
      .useMocker(pipe(mockConfigs, mockUndefined))
      .compile();

    patientService = moduleRef.get<PatientService>(PatientService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(patientService).toBeDefined();
  });

  it('should create a new patient', async () => {
    const user = await prisma.user.create({ data: userStub() });

    const patientDto: CreatePatientDto = {
      userId: user.id,
      weight: 50,
      height: 150,
      age: 50,
      bloodType: BloodType.AB_MINUS,
      gender: Gender.MALE,
      country: 'Norway',
      city: 'Oslo',
      street: 'One famous street',
      apartment: '589',
      zipCode: 52678,
    };

    const createdPatient = await patientService.createPatient(patientDto);

    const expected = {
      weight: patientDto.weight,
      height: patientDto.height,
      age: patientDto.age,
      bloodType: patientDto.bloodType,
      gender: patientDto.gender,
      country: patientDto.country,
      city: patientDto.city,
      street: patientDto.street,
      apartment: patientDto.apartment,
      zipCode: patientDto.zipCode,
    };

    expect(createdPatient).toMatchObject(expected);
    expect(createdPatient.id).toBeDefined();
  });

  it('should return a patient when given a valid patient ID', async () => {
    const user = await prisma.user.create({ data: userStub() });

    const patient = await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });

    const result = await patientService.getPatient(patient.id);

    const expected = {
      weight: 70,
      height: 180,
      age: 30,
      identityCardKey: 'identity_card_key_here',
      bloodType: BloodType.AB_MINUS,
      gender: Gender.MALE,
      country: 'Country Name',
      state: 'State Name',
      city: 'City Name',
      street: 'Street Address',
      apartment: 'Apartment Number',
      zipCode: 12345,
      allergies: [],
    };

    expect(result).toMatchObject(expected);
  });

  it('should return a patient when given a valid user ID', async () => {
    const user = await prisma.user.create({ data: userStub() });

    await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });

    const result = await patientService.getPatientByUserId(user.id);

    const expected = {
      weight: 70,
      height: 180,
      age: 30,
      identityCardKey: 'identity_card_key_here',
      bloodType: BloodType.AB_MINUS,
      gender: Gender.MALE,
      country: 'Country Name',
      state: 'State Name',
      city: 'City Name',
      street: 'Street Address',
      apartment: 'Apartment Number',
      zipCode: 12345,
    };

    expect(result).toMatchObject(expected);
  });

  it('should throw NotFoundException when given an invalid ID', async () => {
    const invalidPatientId = 'invalid_id';

    await expect(async () => await patientService.getPatient(invalidPatientId)).rejects.toThrow(NotFoundException);
  });

  it('should update information about patient', async () => {
    const user = await prisma.user.create({ data: userStub() });

    const patient = await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });

    const newData: PatchPatientDto = {
      weight: 50,
      age: 35,
      identityCardKey: 'new_identity_card_key',
      identityCardType: 'new_identity_card_type',
      emailNotificationToggle: true,
      twoFactorAuthToggle: true,
      requestBillPaymentApproval: false,
    };

    const updatedPatient = await patientService.patchPatient(patient.id, newData);

    const expected = {
      height: 180,
      bloodType: BloodType.AB_MINUS,
      gender: Gender.MALE,
      country: 'Country Name',
      state: 'State Name',
      city: 'City Name',
      street: 'Street Address',
      apartment: 'Apartment Number',
      zipCode: 12345,
      ...updatedPatient,
    };

    expect(updatedPatient).toMatchObject(expected);
  });

  it('should create a patient allergy list', async () => {
    const user = await prisma.user.create({ data: userStub() });

    const patient = await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });

    const allergy = await prisma.allergy.create({ data: { name: 'test' } });

    const result = await patientService.createPatientAllergies(patient.id, { allergyIds: [allergy.id] });

    expect(result).toHaveProperty('count', 1);
  });

  it('should return a patient allergy list', async () => {
    const user = await prisma.user.create({ data: userStub() });

    const patient = await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });

    const allergy = await prisma.allergy.create({ data: { name: 'almond' } });

    await prisma.patientAllergy.create({ data: { patientId: patient.id, allergyId: allergy.id } });

    const result = await patientService.getPatientAllergies(patient.id);

    const expected = [{ id: allergy.id, name: allergy.name }];

    expect(result).toMatchObject(expected);
  });

  it('should create a patient condition list', async () => {
    const user = await prisma.user.create({ data: userStub() });

    const patient = await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });

    const condition = await prisma.condition.create({ data: { name: 'test' } });

    const result = await patientService.createPatientConditions(patient.id, { conditionIds: [condition.id] });

    expect(result).toHaveProperty('count', 1);
  });

  it('should return a patient condition list', async () => {
    const user = await prisma.user.create({ data: userStub() });

    const patient = await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });

    const condition = await prisma.condition.create({ data: { name: 'test' } });

    await prisma.patientCondition.create({ data: { patientId: patient.id, conditionId: condition.id } });

    const result = await patientService.getPatientConditions(patient.id);

    const expected = [{ id: condition.id, name: condition.name }];

    expect(result).toMatchObject(expected);
  });

  it('should delete patient', async () => {
    const user = await prisma.user.create({ data: userStub() });

    const { id } = await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });

    const deleteResult = await patientService.deletePatient(id);

    expect(deleteResult).toBeUndefined();

    const existingPatient = await prisma.patient.findUnique({ where: { id } });

    expect(existingPatient).toBeNull();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.allergy.deleteMany();
    await prisma.patientAllergy.deleteMany();
    await prisma.condition.deleteMany();
    await prisma.patientCondition.deleteMany();
  });
});
