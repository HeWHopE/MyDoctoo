export const joinError = (errors?: string[] | string): string => {
  if (!errors) return 'Something went wrong';
  if (typeof errors === 'string') return errors;
  return errors.join(', ');
};
