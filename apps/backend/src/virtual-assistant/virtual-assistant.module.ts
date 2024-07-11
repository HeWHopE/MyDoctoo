import { Module } from '@nestjs/common';
import { ConditionModule } from '../condition/condition.module';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientModule } from '../patient/patient.module';
import { PrismaService } from '../prisma/prisma.service';
import { SpecializationModule } from '../specialization/specialization.module';
import { VirtualAssistantController } from './virtual-assistant.controller';
import { VirtualAssistantService } from './virtual-assistant.service';

@Module({
  imports: [ConditionModule, SpecializationModule, PatientModule, DoctorModule],
  controllers: [VirtualAssistantController],
  providers: [PrismaService, VirtualAssistantService],
})
export class VirtualAssistantModule {}
