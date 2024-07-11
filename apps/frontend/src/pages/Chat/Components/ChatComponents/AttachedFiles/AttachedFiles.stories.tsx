import type { Meta, StoryObj } from '@storybook/react';

import AttachedFiles from './AttachedFiles';
import '@/index.css';
import { BrowserRouter } from 'react-router-dom';
import { fn } from '@storybook/test';
import { Icon } from '@/components/UI';
import type { TAttachments } from '@/dataTypes/Chat';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

const mockAttachments: TAttachments = {
  attachments: [
    {
      id: '1',
      messageId: 'msg1',
      attachmentKey: 'file1.pdf',
    },
    {
      id: '2',
      messageId: 'msg1',
      attachmentKey: 'file2.docx',
    },
  ],
  totalAttachments: 2,
};

const meta = {
  title: 'Pages/ChatPage/ChatComponents/AttachedFiles/AttachedFiles',
  component: AttachedFiles,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Provider store={store}>
        <BrowserRouter>
          <div className='max-w-80 bg-grey-4 p-10'>
            <Story />
          </div>
        </BrowserRouter>
      </Provider>
    ),
  ],
} satisfies Meta<typeof AttachedFiles>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    chatAttachedFiles: mockAttachments,
  },
};

export const WithBeforeChildren: Story = {
  args: {
    chatAttachedFiles: mockAttachments,
    beforeChildren: (
      <button type='button' onClick={fn}>
        <Icon variant='arrow-right' className='size-10 rotate-180 text-grey-1 transition-all hover:text-dark-grey' />
      </button>
    ),
  },
};
