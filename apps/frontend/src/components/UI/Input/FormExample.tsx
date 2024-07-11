import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import Input from './Input';
import InputPassword from './InputPassword';
import { Button } from '../Button/Button';

interface LoginData {
  name: string;
  email: string;
  password: string;
}

const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

const FormExample = () => {
  const methods = useForm({
    mode: 'onChange',
    resolver: joiResolver(schema),
  });

  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<LoginData> = data => {
    console.log(data);
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)} className='flex flex-col gap-4'>
        <Input label='Name' id='name' type='text' errorMessage='Please write your full name' />
        <Input label='Email' id='email' type='email' errorMessage='Please write your email' />
        <InputPassword label='Password' id='password' errorMessage='Please write your password' />
        <Button type={'secondary'}>Login</Button>
      </form>
    </FormProvider>
  );
};

export default FormExample;
