import dayjs from 'dayjs';

export function generateDate(hour: number) {
  const currentDate = new Date();
  currentDate.setHours(hour, 0, 0, 0);

  return currentDate;
}

export function generateDateDayJs(hour: number) {
  let currentDate = dayjs();

  currentDate = currentDate.set('hour', hour);
  currentDate = currentDate.set('minute', 0);
  currentDate = currentDate.set('second', 0);
  currentDate = currentDate.set('millisecond', 0);

  return currentDate;
}

export function generateLocalDateFromUTCHour(hourUTC: number, unsetMinutes: boolean = false) {
  let localDate = dayjs();
  if (unsetMinutes) {
    localDate = localDate.set('minute', 0);
    localDate = localDate.set('second', 0);
    localDate = localDate.set('millisecond', 0);
  }
  const localDateWithUtcHour = localDate.utc().hour(hourUTC);
  const localDateFinal = localDateWithUtcHour.local();
  return localDateFinal;
}

export function isBetweenDates(start: dayjs.Dayjs, end: dayjs.Dayjs, toBeChecked: dayjs.Dayjs) {
  return toBeChecked.isAfter(start) && toBeChecked.isBefore(end);
}
