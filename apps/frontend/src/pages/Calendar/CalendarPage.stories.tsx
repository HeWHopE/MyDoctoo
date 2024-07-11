import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import CalendarPage from './CalendarPage';
import '@/index.css';

const meta: Meta<typeof CalendarPage> = {
  title: 'Pages/CalendarPage',
  component: CalendarPage,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    selectedDate: new Date('2024-01-01T00:00:00.000Z'),
    setSelectedDate: () => {},
    todayAppointment: [],
  },
  decorators: [
    Story => (
      <Provider store={store}>
        <div className='flex h-screen w-screen overflow-hidden bg-background'>
          <nav className='sidemenu h-full w-20 bg-main'></nav>
          <main className='main-wrapper flex h-full w-full flex-col gap-6 overflow-auto p-8'>
            <Story />
          </main>
        </div>
      </Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
