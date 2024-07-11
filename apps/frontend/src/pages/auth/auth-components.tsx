import type { FC, PropsWithChildren } from 'react';
import { Icon } from '@/components/UI';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

export const LogoWithTitle = () => {
  return (
    <div className='flex items-center gap-1'>
      <Icon className='size-7 text-main' variant='logo' />
      <h1 className='font-syncopate text-2xl font-extrabold text-main'>Doctoo</h1>
    </div>
  );
};

export const AuthCreateAccount = () => {
  return (
    <div className='mx-6 flex justify-center gap-1'>
      <p>{"Don't have an account?"}</p>
      <Link to='/signup' className='text-main'>
        Create one
      </Link>
    </div>
  );
};

export const AuthLogInIntoAccount = () => {
  return (
    <div className='mx-6 flex justify-center gap-1'>
      <p>Already have an account?</p>
      <Link to='/login' className='text-main'>
        Log In
      </Link>
    </div>
  );
};

export const AuthMainContainer: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className='flex h-svh max-h-svh w-svw justify-center '>
      <div className='flex max-h-[100%] w-full items-center justify-center overflow-y-auto sm:w-[60%] '>
        <div className='m-auto flex items-center'>{children}</div>
      </div>
      <div className='hidden h-full w-[40%] bg-greeting-bg bg-cover bg-no-repeat sm:block '> </div>
    </div>
  );
};

export const ErrorMessage: FC<{ message?: string | null; className?: string }> = ({ message, className }) => {
  if (!message) return null;

  return <p className={cn('mt-2 text-sm font-normal leading-[17px] text-error', className)}>{message}</p>;
};

export const Separator = () => <div className='my-auto block w-full border-b-[1px]' />;
