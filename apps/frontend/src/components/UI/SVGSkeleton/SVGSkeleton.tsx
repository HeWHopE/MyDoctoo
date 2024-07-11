import { cn } from '../../../utils/cn';

export const SVGSkeleton = ({ className }: { className: string }) => (
  <svg className={cn(className, 'bg-gray-300 animate-pulse rounded')} />
);
