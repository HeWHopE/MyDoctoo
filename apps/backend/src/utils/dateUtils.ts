export function generateDateFromUTCHour(hour: number) {
  const currentDate = new Date();
  currentDate.setHours(hour, 0, 0, 0);

  return currentDate;
}

export function getDateWithDaysOffset(originalDate: Date, offsetDays: number) {
  const originalUnixTime = originalDate.valueOf();
  const unixTimeWithOffset = originalUnixTime + offsetDays * 24 * 60 * 60 * 1000;
  return new Date(unixTimeWithOffset);
}

export function getMidnightOfDate(originalDate: Date) {
  const newDate = new Date(originalDate);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

export function arrayContainsDate(arr: Date[], dateToCheck: Date) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const pivot = Math.floor((left + right) / 2);
    const pivotDate = arr[pivot];

    if (pivotDate.getTime() === dateToCheck.getTime()) return true;
    else if (dateToCheck < pivotDate) right = pivot - 1;
    else left = pivot + 1;
  }
  return false;
}

export function unsetMinutesSeconds(date: Date) {
  return new Date(new Date(date).setMinutes(0, 0, 0));
}
