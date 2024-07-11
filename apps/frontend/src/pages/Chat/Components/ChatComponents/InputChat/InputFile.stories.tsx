import type { Meta, StoryObj } from '@storybook/react';

import '@/index.css';
import InputFile from './InputFile';
import { fn } from '@storybook/test';

const meta = {
  title: 'Pages/ChatPage/ChatComponents/InputChat/InputFile',
  component: InputFile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='bg-background p-5'>
        <Story />
      </div>
    ),
  ],
  args: {
    handleFileSelect: fn(),
  },
} satisfies Meta<typeof InputFile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
