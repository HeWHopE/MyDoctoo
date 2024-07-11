import { Test, TestingModule } from '@nestjs/testing';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { mockConfigs, mockUndefined, pipe } from '../utils/test-injection-mock';

describe('ReviewController', () => {
  let controller: ReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PatientModule, DoctorModule, EventEmitterModule.forRoot()],
      controllers: [ReviewController],
      providers: [PrismaService, ReviewService],
    })
      .overrideProvider('MAIL_SERVICE')
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .useMocker(pipe(mockConfigs, mockUndefined))
      .compile();

    controller = module.get<ReviewController>(ReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
