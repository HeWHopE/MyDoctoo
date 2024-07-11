import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { FavoriteController } from './favorite.controller';
import { FavoriteService } from './favorite.service';
import { PatientService } from '../patient/patient.service';

describe('FavoriteController', () => {
  let controller: FavoriteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteController],
      providers: [FavoriteService, PrismaService, PatientService],
    }).compile();

    controller = module.get<FavoriteController>(FavoriteController);
  });

  it('Should be defined', () => expect(controller).toBeDefined());
});
