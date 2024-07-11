import DayJS from 'dayjs';

export const formatDateChat = (date: Date | string, everyWithTime12: boolean = false): string => {
  const currentDay = DayJS().startOf('day');
  const messageDay = DayJS(date).startOf('day');
  const isToday = currentDay.isSame(messageDay);
  const isThisWeek = currentDay.diff(messageDay, 'days') < 7;

  if (isToday) {
    return DayJS.utc(date).format('hh:mm a');
  } else if (isThisWeek) {
    return DayJS.utc(date).format(`ddd${everyWithTime12 ? ' hh:mm a' : ''}`);
  } else {
    return DayJS.utc(date).format(`DD.MM.YYYY${everyWithTime12 ? ' hh:mm a' : ''}`);
  }
};
