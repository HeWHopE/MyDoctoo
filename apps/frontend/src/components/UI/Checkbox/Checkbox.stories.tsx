import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import { Checkbox } from './Checkbox';
import '@/index.css';

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

const meta: Meta<typeof Checkbox> = {
  title: 'Components/UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StorybookFormProvider>
      <Checkbox id='checkbox'>Checkbox</Checkbox>
    </StorybookFormProvider>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StorybookFormProvider>
      <Checkbox id='checkbox' disabled>
        Checkbox
      </Checkbox>
    </StorybookFormProvider>
  ),
};
