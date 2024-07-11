import { Injectable } from '@nestjs/common';
import { CreateDoctorScheduleDto } from './dto/create-schedule.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDoctorScheduleDto } from './dto/update-schedule.dto';
import { GetDoctorScheduleQuery } from './dto/get-schedule.query';
import { plainToInstance } from 'class-transformer';
import { ResponseDoctorScheduleDto } from './dto/response-schedule.dto';
import { TimeSlotService } from './time-slot.service';
import { TimeSlotAvailability } from './dto/TimeSlotAvailability';

@Injectable()
export class DoctorScheduleService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly timeSlotService: TimeSlotService,
  ) {}
  async createSchedule(doctorId: string, dto: CreateDoctorScheduleDto): Promise<ResponseDoctorScheduleDto> {
    const schedule = await this.prismaService.doctorSchedule.create({
      data: { ...dto, doctor: { connect: { id: doctorId } } },
    });
    return plainToInstance(ResponseDoctorScheduleDto, schedule);
  }

  async getDoctorSchedule(doctorId: string, query?: GetDoctorScheduleQuery): Promise<ResponseDoctorScheduleDto> {
    const schedule = await this.prismaService.doctorSchedule.findUnique({
      where: { doctorId },
      select: {
        startsWorkHourUTC: true,
        endsWorkHourUTC: true,
      },
    });
    let timeslots = [];
    if (query?.slotAvailability === TimeSlotAvailability.ALL)
      timeslots = await this.timeSlotService.getTimeSlotsForDoctor(schedule, doctorId, query.from, query.to);
    else if (query?.slotAvailability === TimeSlotAvailability.FREE)
      timeslots = await this.timeSlotService.getNearestFreeTimeSlots(schedule, doctorId);
    return plainToInstance(ResponseDoctorScheduleDto, { ...schedule, timeslots });
  }

  async updateSchedule(doctorId: string, dto: UpdateDoctorScheduleDto): Promise<ResponseDoctorScheduleDto> {
    const schedule = await this.prismaService.doctorSchedule.update({ where: { doctorId }, data: dto });
    return plainToInstance(ResponseDoctorScheduleDto, schedule);
  }

  async deleteSchedule(doctorId: string): Promise<void> {
    await this.prismaService.doctorSchedule.delete({ where: { doctorId } });
  }
}
