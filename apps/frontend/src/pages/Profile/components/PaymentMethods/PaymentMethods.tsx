import { Button, Icon } from '@/components/UI';

const PaymentMethods = () => {
  return (
    <div className='flex h-full flex-col justify-between gap-4 rounded-xl bg-white p-3 md:p-7'>
      <div className='flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
        <h3 className='text-lg font-medium text-black'>Payment methods</h3>
        <Button
          type='secondary'
          disabled
          onClick={() => {}}
          className='flex w-3/4 items-center justify-center gap-2 sm:max-w-[140px]'
        >
          <Icon variant='plus' />
          Add
        </Button>
      </div>
      <p>You do not have any payment methods saved</p>
    </div>
  );
};

export default PaymentMethods;
