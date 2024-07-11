import { useEffect, useState, type FC } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router';
import { Icon } from '../../components/UI';
import api from '../../app/api';
import { joinError } from '../../utils/errors';
import { ErrorMessage } from '../auth/auth-components';

const EmailChangePageWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token');

  if (!token) return <Navigate to='/dashboard' />;

  return <EmailChangePage token={token} onSuccess={() => navigate('/dashboard')} />;
};

const REDIRECT_TIMEOUT_MS = 3000;

const EmailChangePage: FC<{ token: string; onSuccess: () => void }> = ({ token, onSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(REDIRECT_TIMEOUT_MS / 1000);

  useEffect(() => {
    const changeEmail = async () => {
      const { error } = await api.POST('/auth/email/change', { body: { token } });
      if (error) return void setError(joinError(error.message));

      setSuccess(true);
      const timer = setTimeout(() => {
        onSuccess();
      }, REDIRECT_TIMEOUT_MS);

      const interval = setInterval(() => {
        if (countdown === 0) return;
        setCountdown(countdown - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    };

    changeEmail();
  }, []);

  return (
    <div className='flex h-svh max-h-svh w-svw flex-col items-center justify-center bg-background'>
      <div className='flex items-center'>
        <h3>Changing email</h3>
        <Icon variant='change' />
      </div>
      <ErrorMessage message={error} />
      {success && <p>Your email has been successfully changed</p>}
      {success && <p>Redirecting to the main page in {countdown}</p>}
    </div>
  );
};

export default EmailChangePageWrapper;
