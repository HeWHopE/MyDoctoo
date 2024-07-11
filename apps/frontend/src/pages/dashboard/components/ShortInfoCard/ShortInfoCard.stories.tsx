import type { Meta, StoryObj } from '@storybook/react';
import ShortInfoCard from './ShortInfoCard';

const meta: Meta<typeof ShortInfoCard> = {
  title: 'Pages/DashboardPage/Components/DoctorCard',
  component: ShortInfoCard,
  decorators: [Story => <Story />],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fullName: 'Dr. Jane Smith',
    about: 'Specialized in cardiology',
    avatarKey: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_15.png',
  },
};

export const WithCostomStyles: Story = {
  args: {
    classNames: 'bg-[#f1f6f9]',
    fullName: 'Dr. Jane Smith',
    about: 'Specialized in cardiology',
    avatarKey: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_15.png',
  },
};
