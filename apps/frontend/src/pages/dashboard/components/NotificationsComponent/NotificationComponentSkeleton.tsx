import { Skeleton } from '../../../../components/UI/Skeleton/Skeleton';

export default function NotificationsComponentSkeleton() {
  return (
    <div className='min-h-[308px] w-full rounded-xl bg-white p-2 sm:p-6'>
      <div className='flex flex-row justify-between gap-2'>
        <h3 className='text-lg'>
          <Skeleton className='w-[104px] max-w-full' />
        </h3>
        <p>
          <Skeleton className='w-[72px] max-w-full' />
        </p>
      </div>
    </div>
  );
}
