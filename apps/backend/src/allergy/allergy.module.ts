import { Module } from '@nestjs/common';
import { AllergyService } from './allergy.service';
import { AllergyController } from './allergy.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [AllergyController],
  providers: [AllergyService, PrismaService],
})
export class AllergyModule {}
