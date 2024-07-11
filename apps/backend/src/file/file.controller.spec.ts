import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mockConfigService } from '../config/config.mock';
import { MinioService } from '../minio/minio.service';
import { FileController } from './file.controller';
import { PatientService } from '../patient/patient.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FileController', () => {
  let controller: FileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [FileController],
      providers: [MinioService, { provide: ConfigService, useValue: mockConfigService }, PatientService, PrismaService],
    }).compile();

    controller = module.get<FileController>(FileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
