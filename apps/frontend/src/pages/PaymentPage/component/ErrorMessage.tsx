import { Button } from '@/components/UI';
import { useNavigate } from 'react-router';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => {
  const navigate = useNavigate();

  const navigateBack = () => {
    navigate('/dashboard');
  };

  return (
    <section className='flex h-[75vh] flex-col items-center justify-center gap-2'>
      <h1 className='text-2xl sm:text-4xl'>Ops. Something wrong :(</h1>
      <p className='mb-4 text-center text-sm sm:text-base'>{message}</p>
      <Button type='primary' btnType='button' className='sm:w-fit' onClick={navigateBack}>
        Go to Dashboard
      </Button>
    </section>
  );
};
