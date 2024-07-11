import { Injectable } from '@nestjs/common';
import { AppointmentStatus } from '@prisma/client';
import { getDateWithDaysOffset, unsetMinutesSeconds } from '../utils/dateUtils';
import { PrismaService } from '../prisma/prisma.service';
import { TimeSlot } from './entities/time-slot.entity';
import { Schedule } from './entities/schedule.entity';

@Injectable()
export class TimeSlotService {
  constructor(private readonly prismaService: PrismaService) {}
  async getTimeSlotsForDoctor(schedule: Schedule, doctorId: string, from?: Date, to?: Date) {
    const rangeStart = this.getNearestStartOFWork(schedule, from || new Date());
    const rangeEnd = this.getNearestEndOfWork(schedule, to || rangeStart);
    const unavailableDates = await this.getAppointmentDatetimes(doctorId, rangeStart, rangeEnd);
    return this.generateTimeSlots(schedule, rangeStart, rangeEnd, unavailableDates);
  }

  async getNearestFreeTimeSlots(schedule: Schedule, doctorId: string) {
    const nearestEndOfWork = this.getNearestEndOfWork(schedule, new Date());
    const bookedAppointments = await this.getAppointmentDatetimes(doctorId, new Date(), nearestEndOfWork);
    return this.generateNearestFreeTimeSlots(schedule, bookedAppointments);
  }

  async isTimeSlotAvailable(doctorId: string, timestamp: string) {
    const schedule = await this.prismaService.doctorSchedule.findUnique({ where: { doctorId } });
    const selectedTimeFlooredToHour = new Date(new Date(timestamp).setUTCMinutes(0, 0, 0));
    if (
      !schedule ||
      selectedTimeFlooredToHour.getUTCHours() < schedule.startsWorkHourUTC ||
      selectedTimeFlooredToHour.getUTCHours() >= schedule.endsWorkHourUTC
    )
      return false;
    const appointmentAtSelectedTime = await this.prismaService.appointment.findFirst({
      where: { doctorId, startedAt: selectedTimeFlooredToHour, status: AppointmentStatus.PLANNED },
    });
    if (appointmentAtSelectedTime) return false;
    return true;
  }

  private async getAppointmentDatetimes(doctorId: string, from: Date, to: Date) {
    const bookedAppointmentDates = (
      await this.prismaService.appointment.findMany({
        where: {
          AND: [
            {
              doctorId,
              startedAt: { gte: from },
              status: { not: AppointmentStatus.CANCELED },
            },
            {
              doctorId,
              startedAt: { lte: to },
              status: { not: AppointmentStatus.CANCELED },
            },
          ],
        },
        select: { startedAt: true },
        orderBy: { startedAt: 'asc' },
      })
    ).map(app => app.startedAt);
    return bookedAppointmentDates;
  }

  private getNearestStartOFWork(schedule: Schedule, nearestTo: Date) {
    let nearestStart: Date;
    const startingHourBeforeEndingHour = schedule.startsWorkHourUTC < schedule.endsWorkHourUTC;
    const startsWorking = new Date(nearestTo).setUTCHours(schedule.startsWorkHourUTC);
    const endsWorking = new Date(nearestTo).setUTCHours(schedule.endsWorkHourUTC);
    if (startingHourBeforeEndingHour && (nearestTo.getTime() <= startsWorking || nearestTo.getTime() < endsWorking))
      nearestStart = new Date(startsWorking);
    else if (startingHourBeforeEndingHour && nearestTo.getTime() >= endsWorking)
      nearestStart = getDateWithDaysOffset(new Date(startsWorking), 1);
    else if (!startingHourBeforeEndingHour && nearestTo.getTime() < endsWorking)
      nearestStart = getDateWithDaysOffset(new Date(startsWorking), -1);
    else if (
      !startingHourBeforeEndingHour &&
      (nearestTo.getTime() >= endsWorking || nearestTo.getTime() > startsWorking)
    )
      nearestStart = new Date(startsWorking);
    return nearestStart;
  }

  private getNearestEndOfWork(schedule: Schedule, nearestTo: Date) {
    let nearestEnd: Date;
    const startingHourBeforeEndingHour = schedule.startsWorkHourUTC < schedule.endsWorkHourUTC;
    const startsWorking = new Date(unsetMinutesSeconds(nearestTo)).setUTCHours(schedule.startsWorkHourUTC);
    const endsWorking = new Date(unsetMinutesSeconds(nearestTo)).setUTCHours(schedule.endsWorkHourUTC);
    if (startingHourBeforeEndingHour && nearestTo.getTime() < startsWorking)
      nearestEnd = getDateWithDaysOffset(new Date(endsWorking), -1);
    else if (startingHourBeforeEndingHour && (nearestTo.getTime() <= endsWorking || nearestTo.getTime() > endsWorking))
      nearestEnd = new Date(endsWorking);
    else if (!startingHourBeforeEndingHour && (nearestTo.getTime() <= endsWorking || nearestTo.getTime() > endsWorking))
      nearestEnd = new Date(endsWorking);
    else if (!startingHourBeforeEndingHour && nearestTo.getTime() > startsWorking)
      nearestEnd = getDateWithDaysOffset(new Date(endsWorking), 1);
    return nearestEnd;
  }

  private generateTimeSlots(schedule: Schedule, from: Date, to: Date, bookedAppointmentDates: Date[]) {
    let currentTimeStamp: number = from.getTime();
    const bookedTimestamps = bookedAppointmentDates.map(date => date.getTime());
    const timeSlots: TimeSlot[] = [];
    while (currentTimeStamp <= to.getTime()) {
      const nearestStartOfWork = this.getNearestStartOFWork(schedule, new Date(currentTimeStamp));
      const nearestEndOfWork = this.getNearestEndOfWork(schedule, new Date(currentTimeStamp));
      if (nearestStartOfWork.getTime() > currentTimeStamp || nearestEndOfWork.getTime() < currentTimeStamp) {
        currentTimeStamp = nearestStartOfWork.getTime();
        continue;
      }
      if (currentTimeStamp === bookedTimestamps[0]) {
        timeSlots.push({ timestamp: new Date(currentTimeStamp), available: false });
        bookedTimestamps.shift();
      } else {
        timeSlots.push({ timestamp: new Date(currentTimeStamp), available: true });
      }
      currentTimeStamp = currentTimeStamp + 60 * 60 * 1000;
    }
    return timeSlots;
  }

  private generateNearestFreeTimeSlots(schedule: Schedule, bookedAppointmentDates: Date[]) {
    const nextPossibleSlotTime: number = unsetMinutesSeconds(
      new Date(new Date().setUTCHours(new Date().getUTCHours() + 1)),
    ).getTime();
    const nearestStartOfWork = this.getNearestStartOFWork(schedule, new Date(nextPossibleSlotTime));
    let currentTimeStamp = Math.max(nextPossibleSlotTime, nearestStartOfWork.getTime());
    const until = this.getNearestEndOfWork(schedule, new Date(currentTimeStamp));
    const bookedTimestamps = bookedAppointmentDates.map(date => date.getTime());
    const timeSlots: TimeSlot[] = [];
    while (currentTimeStamp < until.getTime()) {
      if (currentTimeStamp === bookedTimestamps[0]) bookedTimestamps.shift();
      else {
        timeSlots.push({ timestamp: new Date(currentTimeStamp), available: true });
      }
      currentTimeStamp = currentTimeStamp + 60 * 60 * 1000;
    }
    return timeSlots;
  }
}
