import { Button } from '@/components/UI/Button/Button';
import { AuthCreateAccount, AuthMainContainer, ErrorMessage, LogoWithTitle } from '@/pages/auth/auth-components';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import api from '../../../app/api';
import InputCode from '../../../components/UI/Input/InputCode';
import { joinError } from '../../../utils/errors';
import { cn } from '../../../utils/cn';

const EMAIL_VERIFICATION_CODE_LEN = 6;

const LoginPageAuthenticate = () => {
  const [code, setCode] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();
  const credentials = location.state?.credentials;
  const [serverError, setServerError] = useState<string | null>(null);
  const [resendStatus, setResendStatus] = useState<'sent' | 'error' | 'none'>('none');

  const onSubmit = async () => {
    const { error } = await api.POST('/auth/login/patient/mfa', { body: { ...credentials, code } });
    if (error) return void setServerError(joinError(error.message));
    navigate('/dashboard', { replace: true });
  };

  const onResend = async () => {
    if (resendStatus === 'sent') return;
    setResendStatus('none');
    const { error } = await api.POST('/auth/login/patient', { body: { ...credentials } });
    if (error) {
      setResendStatus('error');
      return void setServerError(joinError(error.message));
    }
    setResendStatus('sent');

    setTimeout(() => {
      setResendStatus('none');
    }, 1000 * 3);
  };

  const onBack = () => {
    navigate('/login', { state: credentials });
  };

  useEffect(() => {
    if (code.length === EMAIL_VERIFICATION_CODE_LEN) {
      onSubmit();
    }
  }, [code]);

  return (
    <AuthMainContainer>
      <form onSubmit={onSubmit} className='my-20 flex w-[360px] flex-col justify-between gap-y-6'>
        <LogoWithTitle />
        <div>
          <h1 className='mb-2 text-xl font-medium leading-none tracking-tight'>Authenticate Your Account</h1>
          <p className='text-grey-1'>
            Protecting your account is our top priority. Please confirm your account by entering the authorization code
            sent to your email
          </p>
        </div>

        <div className='flex justify-center'>
          <InputCode codeLength={EMAIL_VERIFICATION_CODE_LEN} onChange={e => setCode(e.target.value)} />
        </div>

        <div>
          <p>
            It may take a minute to receive your code. Haven’t received it?{' '}
            <a
              onClick={onResend}
              className={cn(
                'text-main hover:cursor-pointer',
                resendStatus === 'sent' && 'text-grey-1 hover:cursor-default',
                resendStatus === 'error' && 'text-red-1',
                resendStatus === 'none' && 'text-main',
              )}
            >
              Resend a new code
            </a>
          </p>
        </div>

        <ErrorMessage message={serverError} />

        <div className='space-y-6'>
          <div className='flex justify-between'>
            <Button btnType='button' onClick={onBack} type='secondary' className='w-[150px]'>
              Back
            </Button>
            <Button
              btnType='button'
              onClick={onSubmit}
              disabled={code.length != EMAIL_VERIFICATION_CODE_LEN}
              type='primary'
              className='w-[150px]'
            >
              Submit
            </Button>
          </div>
          <AuthCreateAccount />
        </div>
      </form>
    </AuthMainContainer>
  );
};

export default LoginPageAuthenticate;
