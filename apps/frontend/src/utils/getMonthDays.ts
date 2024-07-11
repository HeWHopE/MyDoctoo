import type { Dayjs } from 'dayjs';

export const getMonthDays = (currentMonth: Dayjs) => {
  const firstDayOfWeek = currentMonth.startOf('month').startOf('week').weekday(1);
  const lastDayOfMonth = currentMonth.endOf('month').endOf('week');
  const daysDifference = lastDayOfMonth.diff(firstDayOfWeek, 'days') + 2;

  const days = Array.from({ length: daysDifference }, (_, index) => firstDayOfWeek.add(index, 'days'));

  return days;
};
