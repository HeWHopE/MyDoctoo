export const calculateAppointmentPrice = (startedAt: string, doctorPayrate: number, endedAt?: string): number => {
  const startTime = new Date(startedAt);
  const endTime = endedAt ? new Date(endedAt) : new Date(startTime.getTime() + 3600000);

  const timeDiff = endTime.getTime() - startTime.getTime();
  const hours = timeDiff / (1000 * 60 * 60);
  const price = hours * doctorPayrate;

  return price;
};
