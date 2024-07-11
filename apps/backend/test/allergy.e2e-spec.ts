import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateAllergyDto } from '../src/allergy/dto/create.dto';
import { UpdateAllergyDto } from '../src/allergy/dto/update.dto';
import { AllergyModule } from '../src/allergy/allergy.module';

describe('AllergyController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AllergyModule],
      providers: [PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        exceptionFactory: errors => {
          const formattedErrors = errors.map(error => ({
            property: error.property,
            message: error.constraints[Object.keys(error.constraints)[0]],
          }));

          return new BadRequestException({ message: 'Validation failed', errors: formattedErrors });
        },
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => await prisma.allergy.deleteMany());

  describe('/allergy (GET)', () => {
    it('Should return array of objects', async () => {
      await prisma.allergy.create({ data: { name: 'Citrus' } });

      const response = await request(app.getHttpServer()).get('/allergy');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([{ name: 'Citrus' }]);
      expect(response.body[0].id).toBeDefined();
    });
  });

  describe('/allergy (POST)', () => {
    it('Should create allergy', async () => {
      const condtion: CreateAllergyDto = { name: 'Citrus' };

      const response = await request(app.getHttpServer()).post('/allergy').send(condtion);

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({ name: 'Citrus' });
      expect(response.body.id).toBeDefined();
    });
  });

  describe('/allergy/:id (GET)', () => {
    it('Should return allergy object', async () => {
      const allergy: CreateAllergyDto = { name: 'Citrus' };

      const { id } = await prisma.allergy.create({ data: allergy });

      const response = await request(app.getHttpServer()).get(`/allergy/${id}`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(allergy);
      expect(response.body.id).toBeDefined();
    });
  });

  describe('/allergy/:id (PATCH)', () => {
    it('Should return updated object', async () => {
      const allergy: CreateAllergyDto = { name: 'Citrus' };

      const { id } = await prisma.allergy.create({ data: allergy });

      const body: UpdateAllergyDto = {
        name: 'Dust mites',
      };

      const response = await request(app.getHttpServer()).patch(`/allergy/${id}`).send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ ...allergy, ...body });
      expect(response.body.id).toEqual(id);
    });
  });

  describe('/allergy/:id (DELETE)', () => {
    it('Should delete allergy', async () => {
      const allergy: CreateAllergyDto = { name: 'Citrus' };

      const { id } = await prisma.allergy.create({ data: allergy });

      const response = await request(app.getHttpServer()).delete(`/allergy/${id}`);

      expect(response.status).toEqual(200);
    });
  });

  afterAll(() => app.close());
});
