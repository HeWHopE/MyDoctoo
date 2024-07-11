import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import InputPassword from './InputPassword';

const StorybookFormProvider = ({ children }: { children: ReactNode }) => {
  const methods = useForm({
    mode: 'onChange',
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

const meta: Meta<typeof InputPassword> = {
  title: 'Components/UI/InputPassword',
  component: InputPassword,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const PasswordInput: Story = {
  render: () => (
    <StorybookFormProvider>
      <InputPassword id='password' label='New password' />
    </StorybookFormProvider>
  ),
};
