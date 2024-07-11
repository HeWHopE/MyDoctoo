import { cn } from '../../../utils/cn';

export const Skeleton = ({ className }: { className: string }) => (
  <div aria-live='polite' aria-busy='true' className={cn(className)}>
    <span className='inline-flex w-full animate-pulse select-none rounded-md bg-grey-4 leading-none'>‌</span>
  </div>
);
