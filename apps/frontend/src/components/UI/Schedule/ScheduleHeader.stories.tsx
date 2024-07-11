import type { Meta, StoryObj } from '@storybook/react';
import '@/index.css';
import ScheduleHeader from './ScheduleHeader';

const meta = {
  title: 'Components/UI/Schedule/ScheduleHeader',
  component: ScheduleHeader,
  parameters: {
    layout: 'start',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: any) => (
      <div className='w-[700px]'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ScheduleHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fullName: `Dr. John Doe`,
    avatar: `https://randomuser.me/api/portraits`,
    rating: 5,
    reviewsCount: 128,
    specialization: `Cardiologist`,
    payrate: 100,
    doctorId: `123`,
  },
};
