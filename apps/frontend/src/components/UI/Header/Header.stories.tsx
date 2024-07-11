import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import '@/index.css';
import Header from './Header';
import { BrowserRouter } from 'react-router-dom';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/UI/Header',
  component: Header,
  parameters: {
    layout: 'start',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <BrowserRouter>
        <div className='w-full'>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Header>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
};

export const WithChildren: Story = {
  args: {
    children: (
      <Button type='primary' className='bg-white text-main' onClick={fn()}>
        Test
      </Button>
    ),
  },
};
