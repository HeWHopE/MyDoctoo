import type { Meta, StoryObj } from '@storybook/react';

import AttachedFile from './AttachedFile';
import '@/index.css';
import { BrowserRouter } from 'react-router-dom';

const meta = {
  title: 'Pages/ChatPage/ChatComponents/AttachedFiles/AttachedFile',
  component: AttachedFile,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <BrowserRouter>
        <div className='max-w-80 bg-grey-4 p-10'>
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof AttachedFile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fileName: 'Results_James_Anderson.pdf',
  },
};

export const LongFileName: Story = {
  args: {
    fileName: 'Very_long_file_name_that_should_break_to_the_next_line.pdf',
  },
};
