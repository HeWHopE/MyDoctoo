import { Button, Icon, Input, InputPassword, PopupDoctoo } from '@/components/UI';
import {
  AuthLogInIntoAccount,
  AuthMainContainer,
  ErrorMessage,
  LogoWithTitle,
  Separator,
} from '@/pages/auth/auth-components';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { API_URL } from '../../../api/axios.api';
import api from '../../../app/api';
import { joinError } from '../../../utils/errors';

type SignUpType = {
  email: string;
  password: string;
  fullName: string;
  phone: string;
};

const userSignUpSchema = Joi.object<SignUpType>({
  email: Joi.string()
    .trim()
    .email({ tlds: false })
    .messages({
      'string.email': 'Please enter a valid email',
      'string.empty': 'Please enter your email',
    })
    .required(),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter and one number',
      'string.empty': 'Please enter your password',
    }),
  phone: Joi.string()
    .trim()
    .regex(/^\+?\d{10,}$/)
    .messages({
      'string.pattern.base': 'Phone number must have 10 digits.',
      'string.empty': 'Please enter your phone number',
    })
    .required(),
  fullName: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^\w+\s+\w+$/)
    .required()
    .messages({
      'string.pattern.base': 'Please enter your first and last name space separated',
      'string.empty': 'Please enter your first and last name',
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must be less than 30 characters',
    }),
});

const SignUpPage = () => {
  const form = useForm<SignUpType>({
    mode: 'onSubmit',
    resolver: joiResolver(userSignUpSchema),
  });
  const errors = form.formState.errors;
  const [serverError, setServerError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: SignUpType) => {
    const [firstName, lastName] = data.fullName.split(' ');
    const { error } = await api.POST('/auth/signup', {
      body: {
        firstName: firstName,
        lastName: lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: 'PATIENT',
      },
    });

    if (error) return void setServerError(joinError(error.message));
    setServerError(null);
    setOpen(true);
  };

  const onGoogleSignUp = async () => {
    window.open(`${API_URL}/auth/login/google`, '_self');
  };
  const onFacebookSignUp = () => {};

  return (
    <AuthMainContainer>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex w-[340px] flex-col justify-between gap-y-6'>
          <LogoWithTitle />
          <div>
            <h1 className='mb-2 leading-none tracking-tight'>Create account</h1>
            <p className='text-grey-1'>Select a method to create account:</p>
          </div>

          <div className='space-y-6'>
            <div className='flex justify-around'>
              <Button btnType='button' onClick={onGoogleSignUp} type='secondary' className='w-[150px]'>
                <div className='flex gap-2'>
                  <Icon variant='google' />
                  Google
                </div>
              </Button>
              <Button btnType='button' onClick={onFacebookSignUp} type='secondary' className='w-[150px]'>
                <div className='flex gap-2'>
                  <Icon variant='facebook' />
                  Facebook
                </div>
              </Button>
            </div>

            <div className='relative top-1 flex items-center text-grey-1'>
              <Separator />
              <p className='mx-2 min-w-fit'>or continue with email</p>
              <Separator />
            </div>

            <div className='space-y-4'>
              <Input
                type='text'
                label='Name and Surname'
                id='fullName'
                placeholder='John Smith'
                errorMessage={errors.fullName?.message}
              />
              <Input
                type='email'
                label='Email'
                id='email'
                placeholder='john@gmail.com'
                errorMessage={errors.email?.message}
              />
              <Input
                type='phone'
                label='Phone'
                id='phone'
                placeholder='+380501804050'
                errorMessage={errors.phone?.message}
              />
              <InputPassword label='Password' id='password' errorMessage={errors.password?.message} />
            </div>
          </div>

          <ErrorMessage message={serverError} />

          <div className='space-y-6'>
            <Button btnType='submit' onClick={() => {}} type='primary' className='w-full'>
              Create account
            </Button>
            <AuthLogInIntoAccount />
          </div>
        </form>
      </FormProvider>

      <PopupDoctoo
        modalBodyClassName=''
        modalFullClassName='max-w-[700px]'
        closePopup={() => {
          form.reset();
          setOpen(false);
        }}
        popupIsOpen={open}
      >
        <h2 className='mb-3'>Confirm your account</h2>
        <p>The confirmation link has been sent to your email. Please, check your email and confirm your account</p>
      </PopupDoctoo>
    </AuthMainContainer>
  );
};

export default SignUpPage;
