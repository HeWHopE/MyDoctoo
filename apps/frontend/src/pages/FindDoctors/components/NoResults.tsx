import { Icon } from '../../../components/UI';

export const NoResults = () => {
  return (
    <div className='flex h-fit w-full justify-center'>
      <div className='mb-[6vh] mt-[6vh] max-w-[345px] text-center sm:mb-[10vh] sm:mt-[10vh]'>
        <div className='inline-block h-[70px] w-[70px] rounded-full bg-main-light p-4'>
          <Icon variant='search' className='size-10 text-white' />
        </div>
        <h1 className='mt-2 text-center text-2xl font-medium'>No results found</h1>
        <p className='mt-2 text-center text-base font-normal'>
          Try adjusting your search or filter to find what you&lsquo;re looking for
        </p>
      </div>
    </div>
  );
};
