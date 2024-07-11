import { Module } from '@nestjs/common';
import { DeclarationService } from './declaration.service';
import { DeclarationController } from './declaration.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PatientService } from '../patient/patient.service';

@Module({
  controllers: [DeclarationController],
  providers: [DeclarationService, PrismaService, PatientService],
})
export class DeclarationModule {}
