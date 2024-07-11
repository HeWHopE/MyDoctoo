import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import StatsCard from './StatsCard';

const meta: Meta<typeof StatsCard> = {
  title: 'Pages/ProfilePage/StatsCard',
  component: StatsCard,
  decorators: [
    Story => (
      <div className='h-screen bg-background p-8'>
        <Provider store={store}>
          <Story />
        </Provider>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Height: Story = {
  render: () => <StatsCard title='Height, cm' value='174' iconVariant='height' variant='input' />,
};
