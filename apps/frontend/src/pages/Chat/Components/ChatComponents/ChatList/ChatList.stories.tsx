import type { Meta, StoryObj } from '@storybook/react';

import ChatList from './ChatList';
import '@/index.css';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { BrowserRouter } from 'react-router-dom';
import type { TChats } from '@/dataTypes/Chat';

const mockChats: TChats = {
  chats: [
    {
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
        attachments: [],
        appointment: null,
      },
    },
    {
      id: '123e4567-e89b-12d3-a456-426612q24000',
      participant: {
        firstName: 'Jane',
        lastName: 'Moris',
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
        sender: 'PATIENT',
        sentAt: '2024-05-02T07:41:18.065Z',
        text: 'Hello doctor!',
        editedAt: '2024-05-02T07:41:18.065Z',
        attachments: [],
        appointment: null,
      },
    },
  ],
  totalChats: 2,
};

const meta = {
  title: 'Pages/ChatPage/ChatComponents/ChatList/ChatList',
  component: ChatList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Provider store={store}>
        <BrowserRouter>
          <div className='bg-grey-5 p-10'>
            <Story />
          </div>
        </BrowserRouter>
      </Provider>
    ),
  ],
} satisfies Meta<typeof ChatList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    chats: mockChats,
  },
};

export const Empty: Story = {
  args: {
    chats: {
      chats: [],
      totalChats: 0,
    },
  },
};
