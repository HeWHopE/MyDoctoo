import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { HospitalService } from '../hospital/hospital.service';
import { PrismaService } from '../prisma/prisma.service';
import { SpecializationService } from '../specialization/specialization.service';
import { UserService } from '../user/user.service';
import { CreateDoctorDto } from './dto/create.dto';
import { GetDoctorsQuery } from './dto/get.query';
import { PatchDoctorDto } from './dto/patch.dto';
import { ResponseDoctorDto } from './dto/response.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ReviewUpdatedEvent } from '../review/events/review-updated.event';
import { ReviewService } from '../review/review.service';
import { ResponseDoctorListDto } from './dto/response-list.dto';
import { generateDateFromUTCHour, getDateWithDaysOffset, getMidnightOfDate } from '../utils/dateUtils';
import { DoctorScheduleService } from './doctor-schedule.service';
import { TimeSlotAvailability } from './dto/TimeSlotAvailability';
import { StatusFilters } from './dto/StatusFilters';

@Injectable()
export class DoctorService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly hospitalService: HospitalService,
    private readonly specializationService: SpecializationService,
    private readonly scheduleService: DoctorScheduleService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(forwardRef(() => ReviewService)) private readonly reviewService: ReviewService,
  ) {}

  async isDoctorByIdExists(id: string): Promise<boolean> {
    const doctor = await this.prismaService.doctor.findUnique({ where: { id } });

    if (!doctor) throw new NotFoundException({ message: 'Doctor with this Id not found.' });

    return true;
  }

  async isDoctorByUserIdExists(userId: string): Promise<boolean> {
    const doctor = await this.prismaService.doctor.findUnique({ where: { userId } });

    if (doctor) throw new NotFoundException({ message: 'Doctor with this Id already exists.' });

    return true;
  }

  async getAllDoctors(): Promise<ResponseDoctorDto[]> {
    const doctors = await this.prismaService.doctor.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, avatarKey: true } },
        hospitals: { select: { hospital: true } },
        specializations: { select: { specialization: true } },
        _count: { select: { reviews: true } },
      },
    });

    return plainToInstance(ResponseDoctorDto, doctors);
  }

  async getDoctorByUserId(id: string): Promise<ResponseDoctorDto> {
    const doctor = await this.prismaService.doctor.findUnique({
      where: { userId: id },
      include: {
        user: { select: { firstName: true, lastName: true, avatarKey: true } },
        hospitals: { select: { hospital: true } },
        specializations: { select: { specialization: true } },
        _count: { select: { reviews: true } },
      },
    });

    if (!doctor) throw new NotFoundException({ message: 'Doctor with this Id not found.' });

    return plainToInstance(ResponseDoctorDto, doctor);
  }

  async createDoctor(body: CreateDoctorDto): Promise<ResponseDoctorDto> {
    await this.userService.isUserExists(body.userId);

    await this.isDoctorByUserIdExists(body.userId);

    const { hospitalIds, specializationIds, userId, ...doctorData } = body;

    const existingHospitalIds = [];

    // TODO: Optimize this code...
    for (const hospitalId of hospitalIds) {
      const hospital = await this.hospitalService.getHospital(hospitalId);

      existingHospitalIds.push(hospital.id);
    }

    const existingSpecializationIds = [];

    // TODO: Optimize this code...
    for (const specializationId of specializationIds) {
      const specialization = await this.specializationService.getSpecialization(specializationId);
      existingSpecializationIds.push(specialization.id);
    }

    // TODO: Optimize this code...
    const doctor = await this.prismaService.doctor.create({
      data: {
        ...doctorData,
        user: { connect: { id: userId } },
        hospitals: {
          create: existingHospitalIds.map(id => ({ hospital: { connect: { id } } })),
        },
        specializations: {
          create: existingSpecializationIds.map(id => ({ specialization: { connect: { id } } })),
        },
      },
    });

    return plainToInstance(ResponseDoctorDto, doctor);
  }

  async getDoctorsBySpecializationId(specializationId: string): Promise<ResponseDoctorDto[]> {
    const doctors = await this.prismaService.doctorSpecialization.findMany({
      where: { specializationId },
      select: {
        doctor: {
          include: {
            user: { select: { firstName: true, lastName: true, avatarKey: true } },
            hospitals: { select: { hospital: true } },
            specializations: { select: { specialization: true } },
          },
        },
      },
    });

    if (!doctors.length) throw new NotFoundException({ message: 'Doctors with this specialization not found.' });

    return plainToInstance(
      ResponseDoctorDto,
      doctors.map(d => d.doctor),
    );
  }

  // TODO: refactor, extracting filter mapping logic into separate function/s
  async getDoctors(patientId: string, query?: GetDoctorsQuery): Promise<ResponseDoctorListDto> {
    const { hospitalId, specializationId, search, status, availableFrom, availableUntil } = query;
    const page = query.page || 1;
    const itemsPerPage = query.itemsPerPage || 10;
    const offset = (page - 1) * itemsPerPage;

    const hospitalFilter: any = {};
    const specializationFilter: any = {};
    const statusFilter: any = {};
    const availabilityFilter: any = {};
    const searchFilters = [];

    if (hospitalId) hospitalFilter.id = Array.isArray(hospitalId) ? { in: hospitalId } : hospitalId;

    if (specializationId)
      specializationFilter.id = Array.isArray(specializationId) ? { in: specializationId } : specializationId;

    if (status === StatusFilters.TOP_DOCTOR) statusFilter.rating = { gte: 4.5 };
    if (status === StatusFilters.AVAILABLE_NOW) {
      statusFilter.doctorSchedule = {
        AND: [
          { startsWorkHourUTC: { lte: new Date().getUTCHours() + 1 } },
          { endsWorkHourUTC: { gte: new Date().getUTCHours() + 2 } },
        ],
      };
      statusFilter.appointments = { none: { startedAt: generateDateFromUTCHour(new Date().getUTCHours() + 1) } };
    }

    if (availableFrom && availableUntil) {
      const conditions = [];
      for (let i = availableFrom.getUTCHours(); i < availableUntil.getUTCHours(); i++)
        conditions.push({
          doctorSchedule: { AND: [{ startsWorkHourUTC: { lte: i } }, { endsWorkHourUTC: { gte: i + 1 } }] },
          appointments: { none: { startedAt: generateDateFromUTCHour(i) } },
        });
      availabilityFilter.OR = conditions;
    }

    if (search) {
      searchFilters.push({ hospitals: { some: { hospital: { name: { contains: search, mode: 'insensitive' } } } } });
      searchFilters.push({
        specializations: { some: { specialization: { name: { contains: search, mode: 'insensitive' } } } },
      });
      searchFilters.push({
        specializations: {
          some: {
            specialization: {
              conditions: { some: { condition: { name: { contains: search, mode: 'insensitive' } } } },
            },
          },
        },
      });
    }

    const conditions = {
      AND: [
        { hospitals: { some: { hospital: hospitalFilter } } },
        { specializations: { some: { specialization: specializationFilter } } },
        statusFilter,
        searchFilters.length ? { OR: searchFilters } : {},
        availabilityFilter,
      ],
    };

    const doctors = await this.prismaService.doctor.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, avatarKey: true } },
        favorites: { where: { patient: { id: patientId } } },
        hospitals: { select: { hospital: { select: { id: true, name: true } } } },
        specializations: { select: { specialization: true } },
        _count: { select: { reviews: true } },
      },
      where: conditions,
      skip: offset,
      take: itemsPerPage,
    });
    const count = await this.prismaService.doctor.count({ where: conditions });
    const doctorsWithSchedule = await Promise.all(
      doctors.map(async doctor => {
        const schedule = await this.scheduleService.getDoctorSchedule(doctor.id, {
          slotAvailability: TimeSlotAvailability.FREE,
        });
        return { ...doctor, schedule };
      }),
    );

    return plainToInstance(ResponseDoctorListDto, { doctors: doctorsWithSchedule, count });
  }

  async getDoctor(id: string): Promise<ResponseDoctorDto> {
    const doctor = await this.prismaService.doctor.findUnique({
      where: { id },
      include: {
        user: { select: { firstName: true, lastName: true, avatarKey: true } },
        hospitals: { select: { hospital: true } },
        specializations: { select: { specialization: true } },
        _count: { select: { reviews: true } },
        doctorSchedule: { select: { startsWorkHourUTC: true, endsWorkHourUTC: true } },
        appointments: {
          select: { startedAt: true },
          where: {
            AND: [
              {
                startedAt: { gte: new Date() },
              },
              {
                startedAt: { lte: getDateWithDaysOffset(getMidnightOfDate(new Date()), 1) },
              },
            ],
          },
        },
      },
    });

    if (!doctor) throw new NotFoundException({ message: 'Doctor with this Id not found.' });

    return plainToInstance(ResponseDoctorDto, doctor);
  }

  // TODO: refactor, extracting logic for updating hospitals and specializations into separate functions
  async patchDoctor(id: string, body: PatchDoctorDto): Promise<ResponseDoctorDto> {
    await this.isDoctorByIdExists(id);

    const { about, payrate, hospitalIds, specializationIds } = body;

    const addedExistingHospitalIds = [];

    if (hospitalIds?.added?.length) {
      for (const hospitalId of hospitalIds.added) {
        const hospital = await this.hospitalService.getHospital(hospitalId);
        addedExistingHospitalIds.push(hospital.id);
      }
    }

    const addedExistingSpecializationIds = [];

    if (specializationIds?.added?.length) {
      for (const specializationId of specializationIds.added) {
        const specialization = await this.specializationService.getSpecialization(specializationId);
        addedExistingSpecializationIds.push(specialization.id);
      }
    }

    const doctor = await this.prismaService.doctor.update({
      where: { id },
      data: {
        about,
        payrate,
        hospitals: {
          createMany: addedExistingHospitalIds.length
            ? { data: addedExistingHospitalIds.map(id => ({ hospitalId: id })) }
            : undefined,
          deleteMany: hospitalIds?.deleted?.length ? { hospitalId: { in: hospitalIds.deleted } } : undefined,
        },
        specializations: {
          createMany: addedExistingSpecializationIds.length
            ? { data: addedExistingSpecializationIds.map(id => ({ specializationId: id })) }
            : undefined,
          deleteMany: hospitalIds?.deleted?.length
            ? { specializationId: { in: specializationIds.deleted } }
            : undefined,
        },
      },
      include: {
        user: { select: { firstName: true, lastName: true, avatarKey: true } },
        hospitals: { include: { hospital: true } },
        specializations: { include: { specialization: true } },
      },
    });

    return plainToInstance(ResponseDoctorDto, doctor, { exposeUnsetFields: false });
  }

  @OnEvent('review.updated')
  async recalculateDoctorRating(payload: ReviewUpdatedEvent) {
    const { avg: newRating } = await this.reviewService.getAvgRateByDoctorId(payload.doctorId);
    await this.prismaService.doctor.update({
      data: { rating: newRating },
      where: { id: payload.doctorId },
    });
  }

  async getPatientDoctors(id: string): Promise<ResponseDoctorDto[]> {
    const request = {
      where: { patientId: id },
      include: {
        doctor: {
          include: {
            user: true,
            _count: { select: { reviews: true } },

            hospitals: { select: { hospital: true } },
            specializations: { select: { specialization: true } },
          },
        },
      },
    };

    const appointments = await this.prismaService.appointment.findMany(request);

    const doctorsFromAppointments = appointments.map(appointment => appointment.doctor);

    const uniqueDoctors = Array.from(new Map(doctorsFromAppointments.map(doctor => [doctor.id, doctor])).values());

    return uniqueDoctors.map(doctor => plainToInstance(ResponseDoctorDto, doctor, { exposeUnsetFields: false }));
  }

  async deleteDoctor(id: string): Promise<void> {
    await this.getDoctor(id);

    await this.prismaService.doctor.delete({ where: { id } });
  }
}
