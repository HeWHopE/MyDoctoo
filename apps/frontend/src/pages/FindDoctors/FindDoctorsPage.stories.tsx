import type { Meta, StoryObj } from '@storybook/react';
import { FindDoctorsPage } from './FindDoctorsPage';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

import '@/index.css';

const meta: Meta<typeof FindDoctorsPage> = {
  title: 'Pages/FindDoctorsPage',
  component: FindDoctorsPage,
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
        <FindDoctorsPage />
      </Provider>
    </BrowserRouter>
  ),
};
