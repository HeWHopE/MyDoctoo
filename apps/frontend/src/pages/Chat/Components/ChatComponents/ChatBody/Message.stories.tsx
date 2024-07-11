import type { Meta, StoryObj } from '@storybook/react';

import MessageItem from './MessageItem';
import '@/index.css';
import { BrowserRouter } from 'react-router-dom';

const meta = {
  title: 'Pages/ChatPage/ChatComponents/MessageItem',
  component: MessageItem,
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
} satisfies Meta<typeof MessageItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sender: 'participant',
    text: 'Hello, how can I assist you today?',
    sentAt: new Date(),
  },
};

export const MessageFromMe: Story = {
  args: {
    sender: 'me',
    text: 'Hi, I need some help with my results.',
    sentAt: new Date(),
  },
};

export const MessageWithAttachment: Story = {
  args: {
    sender: 'participant',
    text: 'Hi, I need some help with my results.',
    sentAt: new Date(),
    attaches: [
      {
        attachmentKey: 'Results_James_Anderson.pdf',
        id: 'uuid-attachment-1',
        messageId: 'uuid-message-1',
      },
    ],
  },
};
