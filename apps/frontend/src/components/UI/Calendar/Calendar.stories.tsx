import '@/index.css';
import type { Meta, StoryObj } from '@storybook/react';
import dayjs from 'dayjs';
import { Calendar } from './Calendar';

const testMeetings = [
  { date: dayjs('2024-03-9'), status: 'completed' },
  { date: dayjs('2024-03-28'), status: 'completed' },
  { date: dayjs('2024-04-17'), status: 'completed' },
  { date: dayjs('2024-04-17'), status: 'planned' },
  { date: dayjs('2024-04-17'), status: 'canceled' },
  { date: dayjs('2024-04-25'), status: 'planned' },
  { date: dayjs('2024-04-25'), status: 'canceled' },
  { date: dayjs('2024-05-25'), status: 'planned' },
  { date: dayjs('2024-05-28'), status: 'planned' },
  { date: dayjs('2024-05-29'), status: 'planned' },
];

const meta: Meta<typeof Calendar> = {
  title: 'Components/UI/Calendar',
  component: Calendar,
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Calendar meetingsForDay={testMeetings} />,
};
