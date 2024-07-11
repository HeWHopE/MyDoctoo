import { TimeSlot } from './time-slot.entity';

export class Schedule {
  readonly startsWorkHourUTC: number;
  readonly endsWorkHourUTC: number;
  readonly timeslots?: TimeSlot[];
}
