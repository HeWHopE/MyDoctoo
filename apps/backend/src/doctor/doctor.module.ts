import { Module } from '@nestjs/common';
import { HospitalModule } from '../hospital/hospital.module';
import { PrismaService } from '../prisma/prisma.service';
import { SpecializationModule } from '../specialization/specialization.module';
import { UserModule } from '../user/user.module';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { ReviewModule } from '../review/review.module';
import { PatientModule } from '../patient/patient.module';
import { DoctorScheduleService } from './doctor-schedule.service';
import { TimeSlotService } from './time-slot.service';

@Module({
  imports: [UserModule, HospitalModule, SpecializationModule, ReviewModule, PatientModule],
  providers: [DoctorService, DoctorScheduleService, PrismaService, TimeSlotService],
  controllers: [DoctorController],
  exports: [DoctorService, DoctorScheduleService, TimeSlotService],
})
export class DoctorModule {}
