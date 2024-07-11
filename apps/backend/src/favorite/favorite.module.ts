import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { PatientModule } from '../patient/patient.module';

@Module({
  imports: [PatientModule],
  controllers: [FavoriteController],
  providers: [FavoriteService, PrismaService],
})
export class FavoriteModule {}
