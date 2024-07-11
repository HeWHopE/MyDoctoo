import type { Meta, StoryObj } from '@storybook/react';

import '@/index.css';
import InputChat from './InputChat';

const meta = {
  title: 'Pages/ChatPage/ChatComponents/InputChat/InputChat',
  component: InputChat,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='bg-background p-10'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputChat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
