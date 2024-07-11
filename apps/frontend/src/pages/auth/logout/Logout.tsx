import { useAppDispatch } from '@/app/hooks';
import { Button } from '@/components/UI';
import { useNavigate } from 'react-router';
import { logoutThunk } from '../../../app/user/UserThunks';

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    await dispatch(logoutThunk());

    navigate('/login', { replace: true });
  };

  return (
    <div className='flex h-screen items-center justify-center'>
      <div className='text-center'>
        <h1 className='mb-6'>Are you sure?</h1>

        <div className='flex space-x-2'>
          <Button onClick={logout} type='secondary'>
            Yes
          </Button>

          <Button onClick={() => navigate(-1)} type='primary'>
            No
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
