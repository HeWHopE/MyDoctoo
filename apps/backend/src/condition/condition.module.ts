import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConditionController } from './condition.controller';
import { ConditionService } from './condition.service';

@Module({
  controllers: [ConditionController],
  providers: [ConditionService, PrismaService],
  exports: [ConditionService],
})
export class ConditionModule {}
