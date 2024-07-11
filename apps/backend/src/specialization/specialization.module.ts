import { Module } from '@nestjs/common';
import { SpecializationService } from './specialization.service';
import { SpecializationController } from './specialization.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SpecializationController],
  providers: [SpecializationService, PrismaService],
  exports: [SpecializationService],
})
export class SpecializationModule {}
