import type { Meta, StoryObj } from '@storybook/react';
import '@/index.css';
import NavButton from './NavButton';
import { BrowserRouter } from 'react-router-dom';

const meta = {
  title: 'Components/Sidemenu/NavButton',
  component: NavButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <BrowserRouter>
        <div className='w-72 bg-main-medium p-8'>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof NavButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    to: '/dashboard',
    iconVariant: 'dashboard',
    text: 'Dashboard',
    variant: 'large',
    selected: false,
  },
};

export const Selected: Story = {
  args: {
    to: '/dashboard',
    iconVariant: 'dashboard',
    text: 'Dashboard',
    variant: 'large',
    selected: true,
  },
};

export const Small: Story = {
  args: {
    to: '/dashboard',
    iconVariant: 'dashboard',
    text: 'Dashboard',
    variant: 'small',
    selected: false,
  },
};

export const SmallSelected: Story = {
  args: {
    to: '/dashboard',
    iconVariant: 'dashboard',
    text: 'Dashboard',
    variant: 'small',
    selected: true,
  },
};
