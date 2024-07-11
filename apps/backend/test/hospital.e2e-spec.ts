import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateHospitalDto } from '../src/hospital/dto/create.dto';
import { ResponseHospitalDto } from '../src/hospital/dto/response.dto';
import { HospitalModule } from '../src/hospital/hospital.module';
import { hospitalStub } from '../src/hospital/hospital.stub';
import { PrismaService } from '../src/prisma/prisma.service';

describe('HospitalController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HospitalModule],
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

  beforeEach(async () => prisma.hospital.deleteMany());

  describe('/hospital (GET)', () => {
    it('Should return array of objects', async () => {
      await prisma.hospital.create({ data: hospitalStub() });

      const response = await request(app.getHttpServer()).get('/hospital');

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject([hospitalStub()]);
    });
  });

  describe('/hospital (POST)', () => {
    it('Should create hospital without state', async () => {
      const hospital: CreateHospitalDto = hospitalStub();

      const expectedResponseBody: Omit<ResponseHospitalDto, 'id'> = { ...hospital, state: null };

      const response = await request(app.getHttpServer()).post('/hospital').send(hospital);

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject(expectedResponseBody);
    });

    it('Should created hospital with state', async () => {
      const hospital: CreateHospitalDto = { ...hospitalStub(), state: 'test' };

      const response = await request(app.getHttpServer()).post('/hospital').send(hospital);

      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject(hospital);
    });
  });

  describe('/hospital/:id (GET)', () => {
    it('Should return hospital object', async () => {
      const hospital: CreateHospitalDto = hospitalStub();

      const { id } = await prisma.hospital.create({ data: hospital });

      const response = await request(app.getHttpServer()).get(`/hospital/${id}`);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject(hospital);
    });

    it('Should return 404 with non-existent id', async () => {
      const id = 'non-existent';
      const response = await request(app.getHttpServer()).get(`/hospital/${id}`);

      expect(response.status).toEqual(404);
      expect(response.body).toMatchObject({ message: 'Hospital with this Id not found.' });
    });
  });

  describe('/hospital/:id (PATCH)', () => {
    it('Should return updated object', async () => {
      const hospital: CreateHospitalDto = hospitalStub();

      const { id } = await prisma.hospital.create({ data: hospital });

      const body: ResponseHospitalDto = {
        name: 'updated-name',
        country: 'updated-country',
        state: 'updated-state',
        city: 'updated-city',
        street: 'updated-street',
        id,
      };

      const response = await request(app.getHttpServer()).patch(`/hospital/${id}`).send(body);

      expect(response.status).toEqual(200);
      expect(response.body).toMatchObject({ ...hospital, ...body });
    });
  });

  describe('/hospital/:id (DELETE)', () => {
    it('Should delete hospital', async () => {
      const hospital: CreateHospitalDto = hospitalStub();

      const { id } = await prisma.hospital.create({ data: hospital });

      const response = await request(app.getHttpServer()).delete(`/hospital/${id}`);

      expect(response.status).toEqual(200);
    });
  });

  afterAll(() => app.close());
});
