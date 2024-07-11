/* eslint-disable @typescript-eslint/naming-convention */
import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import type { ReactNode } from 'react';
import { joiResolver } from '@hookform/resolvers/joi';
import Joi from 'joi';
import InputPassword from './InputPassword';
import { Button } from '../Button/Button';

const schema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

const StorybookFormProvider = ({ children }: { children: ReactNode }) => {
  const methods = useForm({
    mode: 'onChange',
    resolver: joiResolver(schema),
  });
  const { handleSubmit } = methods;

  const onSubmit: SubmitHandler<FieldValues> = () => {};

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit as SubmitHandler<FieldValues>)} className='flex flex-col gap-4'>
        {children}
      </form>
    </FormProvider>
  );
};

const meta: Meta<typeof Input> = {
  title: 'Components/UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const CVVInput: Story = {
  render: () => (
    <StorybookFormProvider>
      <Input id='cvv' type='text' label='CVV' classNameInput='w-36 bg-background' />
    </StorybookFormProvider>
  ),
};

export const FullName: Story = {
  render: () => (
    <StorybookFormProvider>
      <Input id='fullName' type='text' label='Full Name' placeholder='Full Name' classNameInput='w-72 bg-background' />
    </StorybookFormProvider>
  ),
};

export const Form: Story = {
  render: () => (
    <StorybookFormProvider>
      <Input label='Name' id='name' type='text' errorMessage='Please write your full name' />
      <Input label='Email' id='email' type='email' errorMessage='Please write your email' />
      <InputPassword label='Password' id='password' errorMessage='Please write your password' />
      <Button type={'secondary'}>Login</Button>
    </StorybookFormProvider>
  ),
};
