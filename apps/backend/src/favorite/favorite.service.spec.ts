import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { FavoriteService } from './favorite.service';
import { userStub } from '../user/user.stub';
import { patientStub } from '../patient/patient.stub';
import { doctorStub } from '../doctor/doctor.stub';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserService } from '../user/user.service';
import { DoctorService } from '../doctor/doctor.service';
import { PatientService } from '../patient/patient.service';
import { mockConfigs, mockUndefined, pipe } from '../utils/test-injection-mock';

describe('FavoriteService', () => {
  let service: FavoriteService;
  let prisma: PrismaService;
  let user;
  let patient;
  let doctor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        FavoriteService,
        PrismaService,
        UserService,
        DoctorService,
        PatientService,
        { provide: 'MAIL_SERVICE', useValue: { send: jest.fn(), emit: jest.fn() } },
      ],
    })
      .useMocker(pipe(mockConfigs, mockUndefined))
      .compile();

    service = module.get<FavoriteService>(FavoriteService);
    prisma = module.get<PrismaService>(PrismaService);

    user = await prisma.user.create({ data: userStub() });
    patient = await prisma.patient.create({ data: { ...patientStub(), user: { connect: { id: user.id } } } });
    doctor = await prisma.doctor.create({ data: { ...doctorStub(), user: { connect: { id: user.id } } } });
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return all favorites', async () => {
    const favorite = await prisma.favorite.create({
      data: {
        patient: { connect: { id: patient.id } },
        doctor: { connect: { id: doctor.id } },
      },
    });

    const expected = [
      {
        id: favorite.id,
        patientId: patient.id,
        doctorId: doctor.id,
      },
    ];

    const favorites = await service.getFavorites(patient.Id);

    expect(favorites).toEqual(expected);
  });

  it('Should add a favorite', async () => {
    const favorite = await service.createFavorite(patient.id, { doctorId: doctor.id });

    const expected = {
      id: favorite.id,
      patientId: patient.id,
      doctorId: doctor.id,
    };

    expect(favorite).toEqual(expected);
  });

  it('Should delete a favorite', async () => {
    const favorite = await prisma.favorite.create({
      data: {
        patient: { connect: { id: patient.id } },
        doctor: { connect: { id: doctor.id } },
      },
    });

    await service.deleteFavorite(patient.id, doctor.id);

    const expected = await prisma.favorite.findUnique({
      where: { id: favorite.id },
    });

    expect(expected).toEqual(null);
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.favorite.deleteMany();
  });
});
