import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import * as request from 'supertest';
import { PrismaService } from '../src/prisma/prisma.service';
import { UpdateSpecializationDto } from '../src/specialization/dto/update.dto';
import { SpecializationModule } from '../src/specialization/specialization.module';
import { specializationStub } from '../src/specialization/specialization.stub';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('SpecializationController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [SpecializationModule, EventEmitterModule.forRoot()],
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

  afterEach(async () => {
    await prisma.specialization.deleteMany();
  });

  describe('/specialization (GET)', () => {
    it('Should return array of objects', async () => {
      await prisma.specialization.create({ data: specializationStub() });

      const response = await request(app.getHttpServer()).get('/specialization');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([specializationStub()]);
    });
  });

  describe('/specialization (POST)', () => {
    it('Should create a new specialization', async () => {
      const response = await request(app.getHttpServer()).post('/specialization').send(specializationStub());

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject(specializationStub());
    });
  });

  describe('/specialization/:id (GET)', () => {
    it('Should return specialization object', async () => {
      const { id } = await prisma.specialization.create({ data: specializationStub() });

      const response = await request(app.getHttpServer()).get(`/specialization/${id}`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(specializationStub());
    });

    it('Should return 404 for non-existent specializationId', async () => {
      const id = randomUUID();

      const response = await request(app.getHttpServer()).get(`/specialization/${id}`);

      expect(response.status).toEqual(404);
    });
  });

  describe('/specialization/:id (PATCH)', () => {
    it('Should return updated apecialization object', async () => {
      const createdSpecialization = await prisma.specialization.create({ data: specializationStub() });

      const delta: UpdateSpecializationDto = { name: 'updated-name' };
      const response = await request(app.getHttpServer())
        .patch(`/specialization/${createdSpecialization.id}`)
        .send(delta);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ ...createdSpecialization, ...delta });
    });
  });

  describe('/specialization/:id (DELETE)', () => {
    it('Should delete specialization', async () => {
      const { id } = await prisma.specialization.create({ data: specializationStub() });

      const response = await request(app.getHttpServer()).delete(`/specialization/${id}`);

      expect(response.status).toEqual(200);
      const existingSpecialization = await prisma.specialization.findUnique({ where: { id } });
      expect(existingSpecialization).toBeNull();
    });
  });

  afterAll(() => app.close());
});
