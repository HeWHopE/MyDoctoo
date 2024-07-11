import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';

import ChatTab from './ChatTab';
import '@/index.css';

const meta = {
  title: 'Pages/ChatPage/ChatComponents/ChatTab',
  component: ChatTab,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <BrowserRouter>
        <div className='bg-background p-10'>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof ChatTab>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    to: '/general',
    children: 'General',
  },
};

export const Active: Story = {
  args: {
    to: '/general',
    children: 'General',
    active: true,
  },
};
