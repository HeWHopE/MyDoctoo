import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DoctorService } from '../doctor/doctor.service';
import { PatientService } from '../patient/patient.service';
import { PrismaService } from '../prisma/prisma.service';
import { PatchReviewDto } from './dto/patch.dto';
import { ReviewService } from './review.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('ReviewService', () => {
  let reviewService: ReviewService;

  const reviewId = 'review1';
  const patientId = 'patient1';
  const doctorId = 'doctor1';
  const rate = 5;
  const text = 'Excellent doctor!';

  const responseCreatedReview = { id: reviewId, rate, text, doctorId, createdAt: new Date(), updatedAt: new Date() };

  const responseArrayReviews = [{ id: 'review1', rate, text, doctorId, createdAt: new Date(), updatedAt: new Date() }];

  const mockPrismaService = {
    review: {
      create: jest.fn(),
      findMany: jest.fn(),
      aggregate: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockPatientService = { getPatient: jest.fn() };

  const mockDoctorService = { getDoctor: jest.fn() };

  const mockEventEmitter = { emit: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: PatientService, useValue: mockPatientService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: DoctorService, useValue: mockDoctorService },
      ],
    }).compile();

    reviewService = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(reviewService).toBeDefined();
  });

  describe('createReview', () => {
    const createOptions = {
      data: { patient: { connect: { id: patientId } }, doctor: { connect: { id: doctorId } }, rate, text },
      select: { id: true, rate: true, text: true, doctorId: true, createdAt: true, updatedAt: true },
    };

    it('should create a review', async () => {
      mockPrismaService.review.create.mockResolvedValue(responseCreatedReview);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      const result = await reviewService.createReview(patientId, doctorId, rate, text);

      expect(mockPrismaService.review.create).toHaveBeenCalledWith(createOptions);

      expect(result).toEqual(responseCreatedReview);
    });

    it('should throw an error when the patient is not found', async () => {
      mockPrismaService.review.create = jest.fn();
      mockPatientService.getPatient.mockRejectedValue(new NotFoundException('Patient not found'));

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      await expect(reviewService.createReview(patientId, doctorId, rate, text)).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.review.create).not.toHaveBeenCalledWith(createOptions);
    });

    it('should throw an error when the doctor is not found', async () => {
      mockPrismaService.review.create = jest.fn();
      mockPatientService.getPatient = jest.fn();
      mockDoctorService.getDoctor.mockRejectedValue(new NotFoundException('Doctor not found'));

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      await expect(reviewService.createReview(patientId, doctorId, rate, text)).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.review.create).not.toHaveBeenCalledWith(createOptions);
    });
  });

  describe('getReviews', () => {
    it('should return a list of reviews', async () => {
      mockPrismaService.review.findMany.mockResolvedValue(responseArrayReviews);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      const result = await reviewService.getReviews({ includeNames: false, doctorId: doctorId });

      expect(mockPrismaService.review.findMany).toHaveBeenCalledWith({
        where: { doctorId: doctorId },
        skip: undefined,
        take: undefined,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rate: true,
          text: true,
          doctorId: true,
          createdAt: true,
          updatedAt: true,
          doctor: undefined,
          patient: undefined,
        },
      });

      expect(result).toEqual(responseArrayReviews);
    });

    it('should return a list of reviews with patient and doctor names when includeNames is true', async () => {
      mockPrismaService.review.findMany.mockResolvedValue(responseArrayReviews);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      const result = await reviewService.getReviews({ includeNames: true, doctorId: doctorId });

      expect(mockPrismaService.review.findMany).toHaveBeenCalledWith({
        where: { doctorId: doctorId },
        skip: undefined,
        take: undefined,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          rate: true,
          text: true,
          doctorId: true,
          createdAt: true,
          updatedAt: true,
          doctor: { select: { user: { select: { firstName: true, lastName: true } } } },
          patient: { select: { user: { select: { firstName: true, lastName: true } } } },
        },
      });

      expect(result).toEqual(responseArrayReviews);
    });
  });

  describe('getAvgRateByDoctorId', () => {
    const mockResult = { _avg: { rate: 4.5 }, _count: { _all: 10 } };

    it('should return the average rate and count of reviews for a doctor', async () => {
      mockPrismaService.review.aggregate.mockResolvedValue(mockResult);
      mockDoctorService.getDoctor.mockResolvedValue({ id: doctorId });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      const result = await reviewService.getAvgRateByDoctorId(doctorId);

      expect(mockDoctorService.getDoctor).toHaveBeenCalledWith(doctorId);
      expect(mockPrismaService.review.aggregate).toHaveBeenCalledWith({
        where: { doctorId: doctorId },
        _avg: { rate: true },
        _count: { _all: true },
      });

      expect(result).toEqual({ avg: mockResult._avg.rate, count: mockResult._count._all });
    });

    it('should throw a NotFoundException when the doctor is not found', async () => {
      mockPrismaService.review.aggregate = jest.fn();
      mockDoctorService.getDoctor.mockRejectedValue(new NotFoundException('Doctor not found'));

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      await expect(reviewService.getAvgRateByDoctorId(doctorId)).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.review.aggregate).not.toHaveBeenCalled();
    });
  });

  describe('patchReview', () => {
    const patchReviewDto: PatchReviewDto = { rate: 5, text: 'Great doctor!' };
    const mockReview = { id: reviewId, patientId: patientId, rate: 4, text: 'Good doctor.' };

    it('should update a review', async () => {
      mockPrismaService.review.findFirst.mockResolvedValue(mockReview);
      mockPrismaService.review.update.mockResolvedValue({ ...mockReview, ...patchReviewDto });
      mockPatientService.getPatient.mockResolvedValue({ id: patientId });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      const result = await reviewService.patchReview(reviewId, patientId, patchReviewDto);

      expect(mockPatientService.getPatient).toHaveBeenCalledWith(patientId);
      expect(mockPrismaService.review.findFirst).toHaveBeenCalledWith({ where: { id: reviewId } });
      expect(mockPrismaService.review.update).toHaveBeenCalledWith({
        where: { id: reviewId },
        data: patchReviewDto,
        select: { id: true, rate: true, text: true, doctorId: true, createdAt: true, updatedAt: true },
      });

      expect(result).toEqual({ ...mockReview, ...patchReviewDto });
    });

    it('should throw a NotFoundException when the review is not found', async () => {
      mockPrismaService.review.findFirst = jest.fn();
      mockPrismaService.review.update = jest.fn();
      mockPrismaService.review.findFirst.mockResolvedValue(null);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      await expect(reviewService.patchReview(reviewId, patientId, patchReviewDto)).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.review.update).not.toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException when the patient is not authorized to update the review', async () => {
      mockPrismaService.review.findFirst = jest.fn();
      mockPrismaService.review.update = jest.fn();
      mockPrismaService.review.findFirst.mockResolvedValue({ ...mockReview, patientId: 'anotherPatientId' });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      await expect(reviewService.patchReview(reviewId, patientId, patchReviewDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockPrismaService.review.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteReview', () => {
    const reviewId = 'someReviewId';
    const patientId = 'somePatientId';
    const mockReview = { id: reviewId, patientId: patientId, rate: 4, text: 'Good doctor.' };

    it('should delete a review', async () => {
      mockPrismaService.review.findFirst.mockResolvedValue(mockReview);
      mockPrismaService.review.delete.mockResolvedValue(mockReview);
      mockPatientService.getPatient.mockResolvedValue({ id: patientId });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      const result = await reviewService.deleteReview(reviewId, patientId);

      expect(mockPatientService.getPatient).toHaveBeenCalledWith(patientId);
      expect(mockPrismaService.review.findFirst).toHaveBeenCalledWith({ where: { id: reviewId } });
      expect(result).toBeUndefined();
    });

    it('should throw a NotFoundException when the review is not found', async () => {
      mockPrismaService.review.findFirst = jest.fn();
      mockPrismaService.review.delete = jest.fn();
      mockPrismaService.review.findFirst.mockResolvedValue(null);

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      await expect(reviewService.deleteReview(reviewId, patientId)).rejects.toThrow(NotFoundException);

      expect(mockPrismaService.review.delete).not.toHaveBeenCalled();
    });

    it('should throw an UnauthorizedException when the patient is not authorized to delete the review', async () => {
      mockPrismaService.review.findFirst = jest.fn();
      mockPrismaService.review.delete = jest.fn();
      mockPrismaService.review.findFirst.mockResolvedValue({ ...mockReview, patientId: 'anotherPatientId' });

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          ReviewService,
          { provide: PrismaService, useValue: mockPrismaService },
          { provide: PatientService, useValue: mockPatientService },
          { provide: DoctorService, useValue: mockDoctorService },
          { provide: EventEmitter2, useValue: mockEventEmitter },
        ],
      }).compile();

      reviewService = module.get<ReviewService>(ReviewService);

      await expect(reviewService.deleteReview(reviewId, patientId)).rejects.toThrow(UnauthorizedException);

      expect(mockPrismaService.review.delete).not.toHaveBeenCalled();
    });
  });
});
