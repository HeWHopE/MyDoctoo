import type { Meta, StoryObj } from '@storybook/react';
import { ConferenceButtons } from './ConferenceButton';
import '@/index.css';
import { fn } from '@storybook/test';
import Icon from '@UI/Icon/Icon';

const meta: Meta<typeof ConferenceButtons<string>> = {
  title: 'Components/UI/ConferenceButtons',
  component: ConferenceButtons,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: {
    onClick: fn(),
    options: [
      {
        id: '1',
        label: 'Record',
        value: 'Record',
      },
      {
        id: '2',
        label: 'Record sound',
        value: 'Record sound',
      },
    ],
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className='flex flex-col  items-center justify-center'>
        <Icon variant='chats' className='text-gray-600 size-[24px]' />
        <p>Record</p>
      </div>
    ),
  },
};

export const WithBorder: Story = {
  args: {
    children: (
      <div className='flex flex-col  items-center justify-center'>
        <Icon variant='chats' className='text-gray-600 size-[24px]' />
        <p>Record</p>
      </div>
    ),
    classNames: 'border border-gray-300',
  },
};
