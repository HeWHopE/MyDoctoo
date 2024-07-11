import '@/index.css';
import type { Meta, StoryObj } from '@storybook/react';
import StarsRating from './StarsRating';

const meta: Meta<typeof StarsRating> = {
  title: 'Components/UI/StarsRating',
  component: StarsRating,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
