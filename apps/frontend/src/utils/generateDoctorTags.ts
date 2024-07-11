import dayjs from 'dayjs';
import type { DoctorSchedule } from '../dataTypes/Doctor';

export function generateDoctorTags({ schedule, rating }: { schedule?: DoctorSchedule; rating?: number }) {
  const tags = [];
  if (schedule) {
    const nextPossibleSlot = dayjs()
      .set('hour', dayjs().hour() + 1)
      .set('minute', 0)
      .set('second', 0)
      .set('millisecond', 0)
      .toISOString();
    if (
      schedule.timeslots?.length &&
      schedule.timeslots[0].timestamp === nextPossibleSlot &&
      schedule.timeslots[0].available
    )
      tags.push('Available now');
  }
  if (rating && rating >= 4.5) tags.push('Top doctor');
  return tags;
}
