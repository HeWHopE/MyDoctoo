import '@/index.css';
import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    children: 'Label',
    badgeColor: 'bg-main-light',
    labelColor: 'text-main',
  },
  argTypes: {
    children: {
      control: 'text',
    },
    badgeColor: {
      control: 'text',
    },
    labelColor: {
      control: 'text',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
