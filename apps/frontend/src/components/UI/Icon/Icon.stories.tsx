import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import Icon from './Icon';
import '@/index.css';

const meta = {
  title: 'Components/UI/Icons',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'account',
    className: 'text-grey-1 size-10',
  },
};
