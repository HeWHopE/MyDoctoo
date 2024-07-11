import type { Meta, StoryObj } from '@storybook/react';
import '@/index.css';
import { BrowserRouter } from 'react-router-dom';
import NavLogo from './NavLogo';

const meta = {
  title: 'Components/UI/NavLogo',
  component: NavLogo,
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
} satisfies Meta<typeof NavLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'large',
  },
};

export const Small: Story = {
  args: {
    variant: 'small',
  },
};
