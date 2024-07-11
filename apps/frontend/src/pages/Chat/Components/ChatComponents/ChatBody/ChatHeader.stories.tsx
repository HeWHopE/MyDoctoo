import type { Meta, StoryObj } from '@storybook/react';

import ChatHeader from './ChatHeader';
import '@/index.css';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

const meta = {
  title: 'Pages/ChatPage/ChatComponents/ChatHeader',
  component: ChatHeader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Provider store={store}>
        <div className='bg-grey-5 p-10'>
          <div className='w-[474px] bg-white'>
            <Story />
          </div>
        </div>
      </Provider>
    ),
  ],
} satisfies Meta<typeof ChatHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    participant: {
      firstName: 'John',
      lastName: 'Doe',
      avatarKey: 'acde070d-8c4c-4f0d-9d8a-162843c10333.jpg',
      specializations: ['Hematology'],
    },
  },
};

export const PatientParticipant: Story = {
  args: {
    participant: {
      firstName: 'John',
      lastName: 'Doe',
      avatarKey: 'acde070d-8c4c-4f0d-9d8a-162843c10333.jpg',
    },
  },
};
