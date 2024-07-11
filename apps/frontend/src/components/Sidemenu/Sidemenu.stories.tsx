import type { Meta, StoryObj } from '@storybook/react';
import '@/index.css';
import { BrowserRouter } from 'react-router-dom';
import Sidemenu from './Sidemenu';

const meta = {
  title: 'Components/Sidemenu/Sidemenu',
  component: Sidemenu,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <BrowserRouter>
        <div className='h-[768px]'>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Sidemenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    variant: 'small',
  },
};
