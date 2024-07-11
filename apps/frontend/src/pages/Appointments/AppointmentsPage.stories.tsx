import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import AppointmentsPage from './AppointmentsPage';

const meta: Meta<typeof AppointmentsPage> = {
  title: 'Pages/AppointmentsPage',
  component: AppointmentsPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <BrowserRouter>
      <Provider store={store}>
        <AppointmentsPage />
      </Provider>
    </BrowserRouter>
  ),
};
