import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { mockConfigService } from '../config/config.mock';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentService } from './payment.service';
import { AppointmentService } from '../appointment/appointment.service';

describe('PaymentService', () => {
  let service: PaymentService;

  const mockAppointmentService = {
    isAppointmentExists: jest.fn(),
    patchAppointment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EventEmitterModule.forRoot()],
      providers: [
        PrismaService,
        PaymentService,
        { provide: AppointmentService, useValue: mockAppointmentService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
