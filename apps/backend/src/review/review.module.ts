import { Module, forwardRef } from '@nestjs/common';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';
import { PrismaService } from '../prisma/prisma.service';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [PatientModule, forwardRef(() => DoctorModule)],
  controllers: [ReviewController],
  providers: [PrismaService, ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
