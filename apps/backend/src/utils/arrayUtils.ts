export function removeDuplicates<T>(array: T[], keyFn: (item: T) => any = item => item): T[] {
  const uniqueKeys = new Set();
  const uniqueItems: T[] = [];

  array.forEach(item => {
    const key = keyFn(item);

    if (!uniqueKeys.has(key)) {
      uniqueKeys.add(key);
      uniqueItems.push(item);
    }
  });

  return uniqueItems;
}
