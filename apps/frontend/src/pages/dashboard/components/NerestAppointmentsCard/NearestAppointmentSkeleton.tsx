import { Skeleton } from '../../../../components/UI/Skeleton/Skeleton';

export default function NearestAppointmentsSkeletonComponent() {
  return (
    <>
      <div className='h-min-[306px] flex w-full flex-col gap-7 rounded-xl bg-white p-2 sm:p-6'>
        <h3 className='text-lg'>
          <Skeleton className='w-[104px] max-w-full' />
        </h3>

        <div className='flex flex-col items-center gap-6'>
          <p className='text-center font-normal leading-6'>
            <Skeleton className='w-[350px] max-w-full' />
            <Skeleton className='w-[248px] max-w-full' />
          </p>

          <Skeleton className='w-[200px] max-w-full' />
        </div>
      </div>
    </>
  );
}
