import type { Meta, StoryObj } from '@storybook/react';

import '@/index.css';
import { BrowserRouter } from 'react-router-dom';
import AppointmentMessage from './AppointmentMessage';
import { AppointmentStatus } from '@/dataTypes/Appointment';

const meta = {
  title: 'Pages/ChatPage/ChatComponents/AppointmentMessage',
  component: AppointmentMessage,
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
} satisfies Meta<typeof AppointmentMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appointment: {
      id: 'acde070d-8c4c-4f0d-9d8a-162843c10333',
      status: 'PLANNED',
      startedAt: '2024-05-02T07:41:18.065Z',
    },
  },
};

export const Complited: Story = {
  args: {
    appointment: {
      id: 'acde070d-8c4c-4f0d-9d8a-162843c10333',
      status: AppointmentStatus.COMPLETED,
      startedAt: '2024-05-02T07:41:18.065Z',
    },
  },
};
