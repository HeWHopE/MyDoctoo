import { Module } from '@nestjs/common';
import { MinioModule } from '../minio/minio.module';
import { FileController } from './file.controller';
import { PatientService } from '../patient/patient.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [MinioModule],
  controllers: [FileController],
  providers: [PatientService, PrismaService],
})
export class FileModule {}
