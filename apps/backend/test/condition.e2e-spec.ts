import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ConditionModule } from '../src/condition/condition.module';
import { CreateConditionDto } from '../src/condition/dto/create.dto';
import { UpdateConditionDto } from '../src/condition/dto/update.dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('ConditionController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ConditionModule, EventEmitterModule.forRoot()],
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

  beforeEach(async () => await prisma.condition.deleteMany());

  describe('/condition (GET)', () => {
    it('Should return array of objects', async () => {
      await prisma.condition.create({ data: { name: 'Headache' } });

      const response = await request(app.getHttpServer()).get('/condition');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([{ name: 'Headache' }]);
      expect(response.body[0].id).toBeDefined();
    });
  });

  describe('/condition (POST)', () => {
    it('Should create condtion', async () => {
      const condtion: CreateConditionDto = { name: 'Headache' };

      const response = await request(app.getHttpServer()).post('/condition').send(condtion);

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({ name: 'Headache' });
      expect(response.body.id).toBeDefined();
    });
  });

  describe('/condition/:id (GET)', () => {
    it('Should return condition object', async () => {
      const condition: CreateConditionDto = { name: 'Headache' };

      const { id } = await prisma.condition.create({ data: condition });

      const response = await request(app.getHttpServer()).get(`/condition/${id}`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(condition);
      expect(response.body.id).toBeDefined();
    });
  });

  describe('/condition/:id (PATCH)', () => {
    it('Should return updated object', async () => {
      const condition: CreateConditionDto = { name: 'Headache' };

      const { id } = await prisma.condition.create({ data: condition });

      const body: UpdateConditionDto = {
        name: 'Fever',
      };

      const response = await request(app.getHttpServer()).patch(`/condition/${id}`).send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ ...condition, ...body });
      expect(response.body.id).toEqual(id);
    });
  });

  describe('/condition/:id (DELETE)', () => {
    it('Should delete condition', async () => {
      const condition: CreateConditionDto = { name: 'Headache' };

      const { id } = await prisma.condition.create({ data: condition });

      const response = await request(app.getHttpServer()).delete(`/condition/${id}`);

      expect(response.status).toEqual(200);
    });
  });

  afterAll(() => app.close());
});
