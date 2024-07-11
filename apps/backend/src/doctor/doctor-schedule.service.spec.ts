import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { userStub } from '../user/user.stub';
import { mockConfigs, mockUndefined, pipe } from '../utils/test-injection-mock';
import { DoctorScheduleService } from './doctor-schedule.service';
import { doctorStub } from './doctor.stub';
import { TimeSlotService } from './time-slot.service';

describe('DoctorScheduleService', () => {
  let scheduleService: DoctorScheduleService;
  let prisma: PrismaService;
  const scheduleDto = {
    startsWorkHourUTC: 9,
    endsWorkHourUTC: 20,
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DoctorScheduleService, TimeSlotService, PrismaService],
    })
      .useMocker(pipe(mockConfigs, mockUndefined))
      .compile();

    scheduleService = moduleRef.get<DoctorScheduleService>(DoctorScheduleService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterEach(async () => {
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.doctorSchedule.deleteMany();
  });

  it('should be defined', () => {
    expect(scheduleService).toBeDefined();
  });

  it('should create create schedule', async () => {
    const user = await prisma.user.create({ data: userStub() });
    const doctor = await prisma.doctor.create({ data: { ...doctorStub(), user: { connect: { id: user.id } } } });

    const createdSchedule = await scheduleService.createSchedule(doctor.id, scheduleDto);

    expect(createdSchedule).toMatchObject(scheduleDto);
  });

  it("should return doctor's schedule", async () => {
    const user = await prisma.user.create({ data: userStub() });
    const doctor = await prisma.doctor.create({ data: { ...doctorStub(), user: { connect: { id: user.id } } } });
    await prisma.doctorSchedule.create({
      data: { doctor: { connect: { id: doctor.id } }, ...scheduleDto },
    });

    const returnedSchedule = await scheduleService.getDoctorSchedule(doctor.id);

    expect(returnedSchedule).toMatchObject(scheduleDto);
  });

  it("should update doctor's schedule", async () => {
    const user = await prisma.user.create({ data: userStub() });
    const doctor = await prisma.doctor.create({ data: { ...doctorStub(), user: { connect: { id: user.id } } } });
    await prisma.doctorSchedule.create({
      data: { doctor: { connect: { id: doctor.id } }, ...scheduleDto },
    });

    const newSchedule = { startsWorkHourUTC: 10 };

    const updatedSchedule = await scheduleService.updateSchedule(doctor.id, newSchedule);

    expect(updatedSchedule).toMatchObject({ ...scheduleDto, ...newSchedule });
  });

  it("should delete doctor's schedule", async () => {
    const user = await prisma.user.create({ data: userStub() });
    const doctor = await prisma.doctor.create({ data: { ...doctorStub(), user: { connect: { id: user.id } } } });
    await prisma.doctorSchedule.create({
      data: { doctor: { connect: { id: doctor.id } }, ...scheduleDto },
    });

    await scheduleService.deleteSchedule(doctor.id);

    const persistedSchedule = await prisma.doctorSchedule.findUnique({ where: { doctorId: doctor.id } });
    expect(persistedSchedule).toBeNull();
  });
});
