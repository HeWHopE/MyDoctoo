import type { Meta, StoryObj } from '@storybook/react';
import MyDoctorsPage from './MyDoctorsPage';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

import '@/index.css';

const meta: Meta<typeof MyDoctorsPage> = {
  title: 'pages/MyDoctorsPage/MyDoctorsPage',
  component: MyDoctorsPage,
  parameters: {},
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <BrowserRouter>
      <Provider store={store}>
        <MyDoctorsPage />
      </Provider>
    </BrowserRouter>
  ),
};
