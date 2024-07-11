import { Button, Input } from '@/components/UI';
import { cn } from '@/utils/cn';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Navigate, useLocation, useNavigate } from 'react-router';
import api from '../../../app/api';
import { BloodType, Gender } from '../../../dataTypes/Patient';
import { AuthMainContainer, ErrorMessage } from '../auth-components';

const SignUpPatientPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get('token');
  if (!token) return <Navigate to='/signup' replace />;
  return <SignUpPageOrig token={token} />;
};

type Patient = {
  weight: number;
  height: number;
  age: number;
  bloodType: keyof typeof BloodType;
  gender: keyof typeof Gender;
  country: string;
  city: string;
  street: string;
};

const patientScheme = Joi.object<Patient>({
  weight: Joi.number().min(30).max(1000).required().messages({
    'number.base': 'Weight must be a number',
    'number.min': 'Weight must be more than 30kg',
    'number.max': 'Weight must be less than 1000kg',
  }),
  height: Joi.number().min(50).max(300).required().messages({
    'number.base': 'Height must be a number',
    'number.min': 'Height must be more than 50cm',
    'number.max': 'Height must be less than 300cm',
  }),
  age: Joi.number().min(18).max(130).required().messages({
    'number.base': 'Age must be a number',
    'number.min': 'Age must be more than 18',
    'number.max': 'Age must be less than 130',
  }),
  bloodType: Joi.string()
    .valid(...Object.keys(BloodType))
    .required()
    .messages({ 'any.only': 'Please select blood type' }),
  gender: Joi.string()
    .valid(...Object.keys(Gender))
    .required()
    .messages({ 'any.only': 'Please select you gender' }),
  country: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Country is required',
    'string.min': 'Country must be at least 3 characters long',
    'string.max': 'Country must be less than 100 characters long',
  }),
  city: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'City is required',
    'string.min': 'City must be at least 3 characters long',
    'string.max': 'City must be less than 100 characters long',
  }),
  street: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Street is required',
    'string.min': 'Street must be at least 3 characters long',
    'string.max': 'Street must be less than 100 characters long',
  }),
});

const styles = {
  backgroundImage:
    'linear-gradient(45deg, transparent 50%, #707D7E 50%), linear-gradient(135deg, #707D7E 50%, transparent 50%)',
  backgroundPosition: 'calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px), 100% 0',
  backgroundSize: '5px 5px, 5px 5px, 2.5em 2.5em',
  backgroundRepeat: 'no-repeat',
  '-webkit-appearance': 'none',
  '-moz-appearance': 'none',
};

const SignUpPageOrig = ({ token }: { token: string }) => {
  const navigate = useNavigate();
  const form = useForm<Patient>({
    resolver: joiResolver(patientScheme),
  });
  const errors = form.formState.errors;
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = async (body: Patient) => {
    const { error } = await api.POST('/auth/signup/patient/{token}', {
      body,
      params: { path: { token } },
    });

    if (error) {
      const message = Array.isArray(error.message) ? error.message.join('\n') : error.message;
      setServerError(message);
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <AuthMainContainer>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='lg:min-w[700px] my-6 min-w-[300px] max-w-[700px] space-y-3 md:min-w-[400px]'
        >
          <h2>Continue your registration</h2>
          <Input id='weight' type='text' errorMessage={errors.weight?.message} label='Weight (kg)' />
          <Input id='height' type='text' errorMessage={errors.height?.message} label='Height (cm)' />
          <Input id='age' type='text' errorMessage={errors.age?.message} label='Age' />

          <div>
            <p className={cn('text-md my-2 block text-grey-1')}>Blood type</p>
            <select
              {...form.register('bloodType')}
              defaultValue=''
              className={cn(
                `w-full rounded-lg border border-transparent bg-background py-2 pl-3 pr-10 text-base text-text hover:border-text focus:border-text focus:outline-none`,
                errors.bloodType?.message && 'border border-solid border-error',
              )}
              style={styles}
            >
              <option disabled value=''>
                Select blood type
              </option>
              {Object.keys(BloodType).map(key => (
                <option key={key} value={key}>
                  {BloodType[key as keyof typeof BloodType]}
                </option>
              ))}
            </select>
            <ErrorMessage message={errors.bloodType?.message} />
          </div>

          <div>
            <p className={cn('text-md my-2 block text-grey-1')}>Gender</p>
            <select
              {...form.register('gender')}
              style={styles}
              defaultValue=''
              className={cn(
                `w-full rounded-lg border border-transparent bg-background py-2 pl-3 pr-10 text-base capitalize text-text hover:border-text focus:border-text focus:outline-none`,
                errors.bloodType?.message && 'border border-solid border-error',
              )}
            >
              <option value='' disabled>
                Select gender
              </option>
              {Object.keys(Gender).map(key => (
                <option key={key} value={key} className='capitalize'>
                  {Gender[key as keyof typeof Gender]}
                </option>
              ))}
            </select>
            <ErrorMessage message={errors.gender?.message} />
          </div>

          <Input id='country' type='text' errorMessage={errors.country?.message} label='Country' />
          <Input id='city' type='text' errorMessage={errors.city?.message} label='City' />
          <Input id='street' type='text' errorMessage={errors.street?.message} label='Street' />

          <ErrorMessage message={serverError} />

          <div className='h-3' />

          <Button btnType='submit' type='primary' className='w-full'>
            Sign Up
          </Button>
        </form>
      </FormProvider>
    </AuthMainContainer>
  );
};

export default SignUpPatientPage;
