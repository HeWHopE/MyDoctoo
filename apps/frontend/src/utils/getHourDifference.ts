export const getHourDifference = (startedAt: string, endedAt: string): number => {
  const startDate = new Date(startedAt);
  const endDate = new Date(endedAt);

  const diffMs = endDate.getTime() - startDate.getTime();

  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours;
};
