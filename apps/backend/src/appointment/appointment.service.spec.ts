import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentService } from './appointment.service';
import { PatientModule } from '../patient/patient.module';
import { userStub } from '../user/user.stub';
import { patientStub } from '../patient/patient.stub';
import { doctorStub } from '../doctor/doctor.stub';
import { appointmentStub } from './appointment.stub';
import { AppointmentStatus } from '@prisma/client';
import { CreateAppointmentDto } from './dto/create.dto';
import { PatchAppointmentDto } from './dto/patch.dto';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserService } from '../user/user.service';
import { DoctorService } from '../doctor/doctor.service';
import { mockConfigs, mockUndefined, pipe } from '../utils/test-injection-mock';
import { TimeSlotService } from '../doctor/time-slot.service';
import { randomUUID } from 'crypto';

describe('AppointmentService', () => {
  let appointmentService: AppointmentService;
  let prisma: PrismaService;
  let user;
  let patient;
  let doctor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        AppointmentService,
        PrismaService,
        UserService,
        DoctorService,
        PatientModule,
        TimeSlotService,
        { provide: 'SUMMARIZER_SERVICE', useValue: { connect: jest.fn() } },
        { provide: 'MAIL_SERVICE', useValue: { send: jest.fn(), emit: jest.fn() } },
      ],
    })
      .useMocker(pipe(mockConfigs, mockUndefined))
      .compile();

    appointmentService = module.get<AppointmentService>(AppointmentService);
    prisma = module.get<PrismaService>(PrismaService);

    user = await prisma.user.create({ data: { id: randomUUID(), ...userStub() } });
    patient = await prisma.patient.create({
      data: { id: randomUUID(), ...patientStub(), user: { connect: { id: user.id } } },
    });
    doctor = await prisma.doctor.create({
      data: {
        id: randomUUID(),
        ...doctorStub(),
        user: { connect: { id: user.id } },
        doctorSchedule: { create: { startsWorkHourUTC: 4, endsWorkHourUTC: 20 } },
      },
    });
  });

  it('should be defined', () => {
    expect(appointmentService).toBeDefined();
  });

  it('should create a new appointment', async () => {
    const appointmentDto: CreateAppointmentDto = {
      doctorId: doctor.id,
      patientId: patient.id,
      createdAt: '2024-04-29T07:58:54.171Z',
      status: AppointmentStatus.PLANNED,
      notes: '',
      paymentInvoiceKey: '3cc2c795-323c-49e0-aee4-489874f68da6',
      paymentReceiptKey: '1774940e-b34f-47c2-a5d6-0b7e221a3f8d',
      startedAt: '2024-04-29T07:50:50.171Z',
      endedAt: '2024-04-29T08:50:50.171Z',
    };

    const createdAppointment = await appointmentService.createAppointment(appointmentDto);

    const expected = {
      id: createdAppointment.id,
      ...appointmentDto,
      price: 50,
    };

    expect(createdAppointment).toMatchObject(expected);
    expect(createdAppointment.id).toBeDefined();
  });

  it('should return an appointment list', async () => {
    const appointment = await prisma.appointment.create({
      data: { ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
    });

    const result = await appointmentService.getAppointments();

    const expected = [
      {
        id: appointment.id,
        doctorId: doctor.id,
        patientId: patient.id,
        createdAt: '2024-04-29T07:58:54.171Z',
        status: AppointmentStatus.PLANNED,
        notes: '',
        paymentInvoiceKey: '3cc2c795-323c-49e0-aee4-489874f68da6',
        paymentReceiptKey: '1774940e-b34f-47c2-a5d6-0b7e221a3f8d',
        startedAt: '2024-04-29T07:50:50.171Z',
        endedAt: '2024-04-29T08:50:50.171Z',
        videoRecordKey: null,
      },
    ];

    expect(result).toMatchObject(expected);
  });

  it('should return an appointment list by patient id', async () => {
    const appointment = await prisma.appointment.create({
      data: { ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
    });

    const result = await appointmentService.getAppointmentsByPatientId(patient.id);

    const expected = [
      {
        id: appointment.id,
        doctorId: doctor.id,
        doctor: {
          ...doctor,
          specializations: [],
          hospitals: [],
        },
        patientId: patient.id,
        createdAt: '2024-04-29T07:58:54.171Z',
        status: AppointmentStatus.PLANNED,
        notes: '',
        paymentInvoiceKey: '3cc2c795-323c-49e0-aee4-489874f68da6',
        paymentReceiptKey: '1774940e-b34f-47c2-a5d6-0b7e221a3f8d',
        startedAt: '2024-04-29T07:50:50.171Z',
        endedAt: '2024-04-29T08:50:50.171Z',
        videoRecordKey: null,
      },
    ];

    expect(result).toMatchObject(expected);
  });

  it('should return an appointment list by doctor id', async () => {
    const appointment = await prisma.appointment.create({
      data: { id: randomUUID(), ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
    });

    const result = await appointmentService.getAppointmentsByDoctorId(doctor.id);

    const expected = [
      {
        id: appointment.id,
        doctorId: doctor.id,
        patientId: patient.id,
        patient: {
          ...patient,
        },
        createdAt: '2024-04-29T07:58:54.171Z',
        status: AppointmentStatus.PLANNED,
        notes: '',
        paymentInvoiceKey: '3cc2c795-323c-49e0-aee4-489874f68da6',
        paymentReceiptKey: '1774940e-b34f-47c2-a5d6-0b7e221a3f8d',
        startedAt: '2024-04-29T07:50:50.171Z',
        endedAt: '2024-04-29T08:50:50.171Z',
        videoRecordKey: null,
        doctor: {
          payrate: 50,
          about: 'Initial lorem ipsum text...',
          id: doctor.id,
          rating: 0,
          hospitals: [],
          specializations: [],
          reviewsCount: 0,
          firstName: 'First Name',
          lastName: 'Last Name',
          avatarKey: 'test',
          phone: '+380995698142',
          email: 'user@gmail.com',
        },
      },
    ];

    expect(result).toMatchObject(expected);
  });

  it('should return an appointment by id', async () => {
    const appointment = await prisma.appointment.create({
      data: { ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
    });

    const result = await appointmentService.getAppointment(appointment.id);

    const expected = {
      createdAt: '2024-04-29T07:58:54.171Z',
      status: AppointmentStatus.PLANNED,
      notes: '',
      paymentInvoiceKey: '3cc2c795-323c-49e0-aee4-489874f68da6',
      paymentReceiptKey: '1774940e-b34f-47c2-a5d6-0b7e221a3f8d',
      startedAt: '2024-04-29T07:50:50.171Z',
      endedAt: '2024-04-29T08:50:50.171Z',
    };

    expect(result).toMatchObject(expected);
  });

  it('should update information about appointment', async () => {
    const appointment = await prisma.appointment.create({
      data: { ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
    });

    const newData: PatchAppointmentDto = {
      status: AppointmentStatus.COMPLETED,
      notes: 'Notes about this appointment',
    };

    const result = await appointmentService.patchAppointment(appointment.id, newData);

    const expected = {
      ...appointmentStub(),
      status: AppointmentStatus.COMPLETED,
      notes: 'Notes about this appointment',
    };

    expect(result).toMatchObject(expected);
  });

  it('should delete appointment', async () => {
    const appointment = await prisma.appointment.create({
      data: { ...appointmentStub(), patientId: patient.id, doctorId: doctor.id },
    });

    const result = await appointmentService.deleteAppointment(appointment.id);

    expect(result).toBeUndefined();
  });

  afterEach(async () => {
    await prisma.user.deleteMany();
    await prisma.patient.deleteMany();
    await prisma.doctor.deleteMany();
    await prisma.appointment.deleteMany();
  });
});
