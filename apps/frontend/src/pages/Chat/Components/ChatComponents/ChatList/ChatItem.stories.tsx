import type { Meta, StoryObj } from '@storybook/react';

import ChatItem from './ChatItem';
import '@/index.css';
import { Role } from '@/dataTypes/User';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import type { TChat } from '@/dataTypes/Chat';

const mockChat: TChat = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  participant: {
    firstName: 'John',
    lastName: 'Doe',
    avatarKey: 'acde070d-8c4c-4f0d-9d8a-162843c10333.jpg',
    specializations: ['Hematology'],
  },
  missedMessagesDoctor: 0,
  missedMessagesPatient: 1,
  doctorId: '123e4567-e89b-12d3-a456-4266141waw000',
  patientId: '123e4567-e89b-12d3-a456-4266waw74000',
  lastMessage: {
    id: '349c9ffc-1427-459d-a260-1e3f186b9db2',
    chatId: '349c9ffc-1427-459d-a260-1e3f186b9db2',
    sender: 'DOCTOR',
    sentAt: '2024-05-02T07:41:18.065Z',
    text: 'Hello patient!',
    editedAt: '2024-05-02T07:41:18.065Z',
    attachments: [
      {
        id: '349c9ffc-1427-459d-a260-1e3f186b9db2',
        messageId: '349c9ffc-1427-459d-a260-1e3f186b9db2',
        attachmentKey: '123e4567-e89b-12d3-a456-426614174000.jpeg',
      },
    ],
    appointment: null,
  },
};

const meta = {
  title: 'Pages/ChatPage/ChatComponents/ChatList/ChatItem',
  component: ChatItem,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Provider store={store}>
        <div className='bg-grey-5 p-10'>
          <Story />
        </div>
      </Provider>
    ),
  ],
} satisfies Meta<typeof ChatItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    chat: mockChat,
    active: false,
  },
};

export const Active: Story = {
  args: {
    chat: mockChat,
    active: true,
  },
  parameters: {
    user: {
      role: Role.DOCTOR,
    },
  },
};
