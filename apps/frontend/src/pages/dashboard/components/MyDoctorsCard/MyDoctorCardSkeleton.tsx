import { Skeleton } from '../../../../components/UI/Skeleton/Skeleton';

export default function MyDoctorsCardSkeleton() {
  return (
    <>
      <aside className='flex h-full min-h-[236px] w-full justify-start gap-6 rounded-xl bg-white p-2 sm:p-6 lg:max-w-[302px]'>
        <div className='flex flex-col items-center justify-between'>
          <h3 className='text-left text-lg font-medium leading-6'>
            <Skeleton className='w-32' />
          </h3>
        </div>
      </aside>
    </>
  );
}
