import { Button, Input } from '@/components/UI';
import { AuthMainContainer, ErrorMessage, LogoWithTitle } from '@/pages/auth/auth-components';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router';
import api from '../../../app/api';
import { joinError } from '../../../utils/errors';

type SignInType = {
  email: string;
  password: string;
};
const userLogInSchema = Joi.object<SignInType>({
  email: Joi.string()
    .email({ tlds: false })
    .messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required',
    })
    .required(),
  password: Joi.string()
    .min(8)
    .messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required',
    })
    .required(),
});

const DoctorLoginPage = () => {
  const location = useLocation();
  const form = useForm<SignInType>({
    mode: 'onSubmit',
    defaultValues: {
      email: location.state?.email || '',
      password: location.state?.password || '',
    },
    resolver: joiResolver(userLogInSchema),
  });
  const errors = form.formState.errors;
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onLogin: SubmitHandler<SignInType> = async body => {
    const { error } = await api.POST('/auth/login/doctor', { body });
    if (error) return void setServerError(joinError(error.message));
    else navigate('/dashboard', { replace: true });
  };

  return (
    <AuthMainContainer>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onLogin)} className='flex w-[340px] flex-col justify-between gap-y-6'>
          <LogoWithTitle />
          <div>
            <h1 className='mb-2 leading-none tracking-tight'>Log In</h1>
          </div>

          <div className='space-y-6'>
            <div className='space-y-4'>
              <Input
                id='email'
                type='email'
                label='Email'
                placeholder='John@gmail.com'
                errorMessage={errors.email?.message}
              />
              <Input
                id='password'
                type='password'
                label='Password'
                placeholder=''
                errorMessage={errors.password?.message}
              />
            </div>
          </div>
          <ErrorMessage message={serverError} />

          <div className='space-y-6'>
            <Button btnType='submit' type='primary' className='w-full'>
              Log in
            </Button>
          </div>
        </form>
      </FormProvider>
    </AuthMainContainer>
  );
};

export default DoctorLoginPage;
