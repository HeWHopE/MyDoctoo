import '@/index.css';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PaymentMethodCard } from './PaymentMethodCard';

const meta: Meta<typeof PaymentMethodCard> = {
  title: 'Components/UI/PaymentMethodCard',
  component: PaymentMethodCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClickEdit: fn(),
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Editable: Story = {
  args: {
    card: {
      number: '1111 2222 3333 4444',
      expiresAt: new Date('2024-01-01T00:00:00.000Z'),
    },
    editable: true,
  },
};

export const NotEditable: Story = {
  args: {
    card: {
      number: '1111 2222 3333 4444',
      expiresAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  },
};
