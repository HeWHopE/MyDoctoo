import type { Meta, StoryObj } from '@storybook/react';

import '@/index.css';
import ChatTextArea from './ChatTextArea';

const meta = {
  title: 'Pages/ChatPage/ChatComponents/InputChat/ChatTextArea',
  component: ChatTextArea,
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
} satisfies Meta<typeof ChatTextArea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
