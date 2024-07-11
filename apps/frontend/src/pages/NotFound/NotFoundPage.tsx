import { Button } from '@/components/UI';
import { useNavigate } from 'react-router';

const NotFoundPage = () => {
  const navigate = useNavigate();

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='flex flex-col items-center gap-2 text-black'>
        <span className='text-6xl font-medium text-black-2'>404</span>
        <span className='text-2xl font-medium text-black-2'>Page Not Found</span>
        <span className='pb-4'>The page you requested could not be found</span>
        <Button type='primary' onClick={goToDashboard}>
          Back to the Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
