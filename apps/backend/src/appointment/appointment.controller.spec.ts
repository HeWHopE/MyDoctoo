import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PatientService } from '../patient/patient.service';
import { DoctorService } from '../doctor/doctor.service';
import { mockConfigs, mockUndefined, pipe } from '../utils/test-injection-mock';

describe('AppointmentController', () => {
  let controller: AppointmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      controllers: [AppointmentController],
      providers: [
        AppointmentService,
        PrismaService,
        PatientService,
        DoctorService,
        { provide: 'SUMMARIZER_SERVICE', useValue: { connect: jest.fn() } },
      ],
    })
      .useMocker(pipe(mockConfigs, mockUndefined))
      .compile();

    controller = module.get<AppointmentController>(AppointmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
