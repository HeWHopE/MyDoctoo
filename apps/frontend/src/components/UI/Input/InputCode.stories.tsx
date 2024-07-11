import type { Meta, StoryObj } from '@storybook/react';
import InputCode from './InputCode';

const meta: Meta<typeof InputCode> = {
  title: 'Components/UI/InputCode',
  component: InputCode,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const PasswordInput: Story = {
  args: {
    codeLength: 6,
  },
  argTypes: {
    codeLength: {
      control: {
        type: 'number',
      },
    },
  },
};
