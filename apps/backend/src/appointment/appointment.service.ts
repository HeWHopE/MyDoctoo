import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { Role } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { TimeoutError, lastValueFrom, timeout } from 'rxjs';
import { ChatAppointmentUpdatedEvent } from 'src/chat/events/chat-appointment-updated.event copy';
import { ChatAppointmentCreatedEvent } from '../chat/events/chat-appointment-created.event';
import { DoctorService } from '../doctor/doctor.service';
import { PatientService } from '../patient/patient.service';
import { PrismaService } from '../prisma/prisma.service';
import { calculateAppointmentPrice } from '../utils/calculateAppointmentPrice';
import { emitEventBasedOnAppointmentStatus } from '../utils/emitEventBasedOnAppointmentStatus';
import { AppointmentNotesReponseDto } from './dto/appointment-notes-response.dto';
import { CreateAppointmentDto } from './dto/create.dto';
import { PatchAppointmentDto } from './dto/patch.dto';
import { ResponseAppointmentDto } from './dto/response.dto';
import { UpdateAppointmentNotesDto } from './dto/update-appointment-notes.dto';
import { TimeSlotService } from '../doctor/time-slot.service';

@Injectable()
export class AppointmentService {
  private logger: Logger;
  constructor(
    private readonly prismaService: PrismaService,
    private readonly doctorService: DoctorService,
    private readonly patientService: PatientService,
    private readonly eventEmitter: EventEmitter2,
    private readonly timeSlotService: TimeSlotService,
    @Inject('SUMMARIZER_SERVICE') private readonly summarizerClient: ClientProxy,
  ) {
    this.logger = new Logger(AppointmentService.name);
  }

  onModuleInit() {
    this.summarizerClient.connect();
  }

  async isAppointmentExists(id: string): Promise<boolean> {
    const appointment = await this.prismaService.appointment.findUnique({ where: { id } });

    if (!appointment) throw new NotFoundException('An appointment with this Id not found.');

    return true;
  }

  async createAppointment(body: CreateAppointmentDto): Promise<ResponseAppointmentDto> {
    await this.patientService.isPatientByIdExists(body.patientId);

    const doctor = await this.doctorService.getDoctor(body.doctorId);
    const isSlotAvailable = await this.timeSlotService.isTimeSlotAvailable(body.doctorId, body.startedAt);
    if (!isSlotAvailable) throw new BadRequestException('Selected time slot is not available for booking');
    const price = calculateAppointmentPrice(body.startedAt, doctor.payrate, body.endedAt);

    const appointment = await this.prismaService.appointment.create({ data: { ...body, price } });

    // TODO: Use event isntead of directly call payment service.
    if (appointment) {
      this.eventEmitter.emit(
        'chat.appointment-created',
        new ChatAppointmentCreatedEvent(body.patientId, body.doctorId, appointment),
      );
    }
    emitEventBasedOnAppointmentStatus(this.eventEmitter, appointment);

    return plainToInstance(ResponseAppointmentDto, appointment);
  }

  async getAppointments(): Promise<ResponseAppointmentDto[]> {
    const appointments = await this.prismaService.appointment.findMany();

    return plainToInstance(ResponseAppointmentDto, appointments);
  }

  async getAppointmentsByUserId(
    userId: string,
    role: Role,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ResponseAppointmentDto[]> {
    const whereClause: any = {
      [role.toLocaleLowerCase()]: { userId },
    };

    if (startDate && endDate) {
      whereClause.startedAt = { gte: startDate, lte: endDate };
    } else if (startDate) {
      whereClause.startedAt = { gte: startDate };
    } else if (endDate) {
      whereClause.startedAt = { lte: endDate };
    }

    try {
      const appointments = await this.prismaService.appointment.findMany({
        where: whereClause,
        include: {
          doctor: {
            include: {
              user: {
                select: { firstName: true, lastName: true, avatarKey: true, phone: true, email: true },
              },
              hospitals: { select: { hospital: { select: { id: true, name: true } } } },
              specializations: { select: { specialization: true } },
              _count: { select: { reviews: true } },
            },
          },
          patient: {
            include: {
              user: {
                select: { firstName: true, lastName: true, avatarKey: true, phone: true, email: true },
              },
            },
          },
        },
      });
      return plainToInstance(ResponseAppointmentDto, appointments);
    } catch (error) {
      console.log(error);

      return [];
    }
  }

  async getAppointmentsByPatientId(id: string): Promise<ResponseAppointmentDto[]> {
    await this.patientService.isPatientByIdExists(id);

    const appointments = await this.prismaService.appointment.findMany({
      where: { patientId: id },
      include: {
        doctor: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatarKey: true, phone: true, email: true },
            },
            hospitals: { select: { hospital: { select: { id: true, name: true } } } },
            specializations: { select: { specialization: true } },
            _count: { select: { reviews: true } },
          },
        },
      },
    });

    return plainToInstance(ResponseAppointmentDto, appointments);
  }

  async getAppointmentsByDoctorId(id: string): Promise<ResponseAppointmentDto[]> {
    await this.doctorService.isDoctorByIdExists(id);

    const appointments = await this.prismaService.appointment.findMany({
      where: { doctorId: id },
      include: {
        patient: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatarKey: true, phone: true, email: true },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatarKey: true, phone: true, email: true },
            },
            hospitals: { select: { hospital: { select: { id: true, name: true } } } },
            specializations: { select: { specialization: true } },
            _count: { select: { reviews: true } },
          },
        },
      },
    });

    return plainToInstance(ResponseAppointmentDto, appointments);
  }

  async getAppointment(id: string): Promise<ResponseAppointmentDto> {
    await this.isAppointmentExists(id);

    const appointment = await this.prismaService.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatarKey: true, phone: true, email: true },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: { firstName: true, lastName: true, avatarKey: true, phone: true, email: true },
            },
            hospitals: { select: { hospital: { select: { id: true, name: true } } } },
            specializations: { select: { specialization: true } },
            _count: { select: { reviews: true } },
          },
        },
      },
    });

    return plainToInstance(ResponseAppointmentDto, appointment);
  }

  async patchAppointment(id: string, body: PatchAppointmentDto): Promise<ResponseAppointmentDto> {
    await this.isAppointmentExists(id);

    const appointment = await this.prismaService.appointment.update({ where: { id }, data: body });

    if (appointment) {
      this.eventEmitter.emit('chat.appointment-updated', new ChatAppointmentUpdatedEvent(appointment));
    }
    emitEventBasedOnAppointmentStatus(this.eventEmitter, appointment);

    return plainToInstance(ResponseAppointmentDto, appointment);
  }

  async updateNotes(actionUserId: string, appointmentId: string, dto: UpdateAppointmentNotesDto) {
    const appointment = await this.getAppointment(appointmentId);
    const doctor = await this.doctorService.getDoctorByUserId(actionUserId).catch(() => null);
    const patient = await this.patientService.getPatientByUserId(actionUserId).catch(() => null);
    if (appointment.doctorId !== doctor?.id && appointment.patientId !== patient?.id) throw new ForbiddenException();

    try {
      let summary = null;
      if (dto.notes)
        summary = await lastValueFrom(
          this.summarizerClient.send({ cmd: 'GenerateSummary' }, { text: dto.notes }).pipe(timeout(13000)),
        );
      await this.prismaService.appointment.update({
        where: { id: appointmentId },
        data: { notes: dto.notes, notesSummary: summary },
      });
      return plainToInstance(AppointmentNotesReponseDto, { notes: dto.notes, summary });
    } catch (err) {
      if (err instanceof TimeoutError) {
        this.logger.error('Summarizer service invocation timed out');
        throw new HttpException({ message: 'Timed out' }, HttpStatus.GATEWAY_TIMEOUT);
      }
      throw new InternalServerErrorException();
    }
  }

  async deleteAppointment(id: string): Promise<void> {
    await this.isAppointmentExists(id);

    await this.prismaService.appointment.delete({ where: { id } });
  }
}
