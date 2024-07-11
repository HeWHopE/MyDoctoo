import { Test } from '@nestjs/testing';
import { HospitalModule } from '../hospital/hospital.module';
import { hospitalStub } from '../hospital/hospital.stub';
import { PrismaService } from '../prisma/prisma.service';
import { SpecializationModule } from '../specialization/specialization.module';
import { userStub } from '../user/user.stub';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from './dto/create.dto';
import { PatchDoctorDto } from './dto/patch.dto';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ReviewService } from '../review/review.service';
import { UserService } from '../user/user.service';
import { mockConfigs, mockUndefined, pipe } from '../utils/test-injection-mock';
import { DoctorScheduleService } from './doctor-schedule.service';
import { TimeSlotService } from './time-slot.service';

describe('DoctorService', () => {
  let doctorService: DoctorService;
  let prisma: PrismaService;

  const mockReviewService = {};

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [HospitalModule, SpecializationModule, EventEmitterModule.forRoot()],
      providers: [
        DoctorService,
        PrismaService,
        UserService,
        DoctorScheduleService,
        TimeSlotService,
        { provide: ReviewService, useValue: mockReviewService },
        { provide: 'MAIL_SERVICE', useValue: { send: jest.fn(), emit: jest.fn() } },
      ],
    })
      .useMocker(pipe(mockConfigs, mockUndefined))
      .compile();

    doctorService = moduleRef.get<DoctorService>(DoctorService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.doctor.deleteMany();
    await prisma.user.deleteMany();
  });

  it('should be defined', () => {
    expect(doctorService).toBeDefined();
  });

  it('should create doctor', async () => {
    const user = await prisma.user.create({ data: userStub() });
    const specialization = await prisma.specialization.create({ data: { name: 'test' } });
    const hospital = await prisma.hospital.create({ data: hospitalStub() });

    const doctorDto: Partial<CreateDoctorDto> = { about: 'test', payrate: 50, userId: user.id };

    const createdDoctor = await doctorService.createDoctor({
      ...doctorDto,
      specializationIds: [specialization.id],
      hospitalIds: [hospital.id],
    } as CreateDoctorDto);

    const expected = { about: doctorDto.about, payrate: doctorDto.payrate };

    expect(createdDoctor).toMatchObject(expected);
    expect(createdDoctor.id).toBeDefined();
  });

  it('should return doctor by id', async () => {
    const user = await prisma.user.create({ data: userStub() });
    const specialization = await prisma.specialization.create({ data: { name: 'test' } });
    const hospital = await prisma.hospital.create({ data: hospitalStub() });

    const doctorDto: Partial<CreateDoctorDto> = { about: 'test', payrate: 50, userId: user.id };

    const { id } = await prisma.doctor.create({
      data: {
        ...doctorDto,
        specializations: { create: { specialization: { connect: { id: specialization.id } } } },
        hospitals: { create: { hospital: { connect: { id: hospital.id } } } },
      } as CreateDoctorDto,
    });

    const doctor = await doctorService.getDoctor(id);

    const expected = { id, about: doctorDto.about, payrate: doctorDto.payrate };

    expect(doctor).toMatchObject(expected);
  });

  it('should update doctor', async () => {
    const user = await prisma.user.create({ data: userStub() });
    const specialization = await prisma.specialization.create({ data: { name: 'test' } });
    const hospital = await prisma.hospital.create({ data: hospitalStub() });

    const doctorDto: Partial<CreateDoctorDto> = { about: 'test', payrate: 50, userId: user.id };

    const { id } = await prisma.doctor.create({
      data: {
        ...doctorDto,
        specializations: { create: { specialization: { connect: { id: specialization.id } } } },
        hospitals: { create: { hospital: { connect: { id: hospital.id } } } },
      } as CreateDoctorDto,
    });

    const delta: PatchDoctorDto = { about: 'updated-about', payrate: 25 };

    const updatedDoctor = await doctorService.patchDoctor(id, delta);

    const expected = { id, about: doctorDto.about, payrate: doctorDto.payrate, ...delta };

    expect(updatedDoctor).toMatchObject(expected);
  });

  it('should delete doctor', async () => {
    const user = await prisma.user.create({ data: userStub() });
    const specialization = await prisma.specialization.create({ data: { name: 'test' } });
    const hospital = await prisma.hospital.create({ data: hospitalStub() });

    const doctorDto: Partial<CreateDoctorDto> = { about: 'test', payrate: 50, userId: user.id };

    const { id } = await prisma.doctor.create({
      data: {
        ...doctorDto,
        specializations: { create: { specialization: { connect: { id: specialization.id } } } },
        hospitals: { create: { hospital: { connect: { id: hospital.id } } } },
      } as CreateDoctorDto,
    });

    const deleteResult = await doctorService.deleteDoctor(id);

    expect(deleteResult).toBeUndefined();
  });
});
