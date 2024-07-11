import type { Meta, StoryObj } from '@storybook/react';
import ProfilePage from './ProfilePage';
import { Provider } from 'react-redux';
import { store } from '@/app/store';

const meta: Meta<typeof ProfilePage> = {
  title: 'Pages/ProfilePage',
  component: ProfilePage,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Provider store={store}>
      <ProfilePage />
    </Provider>
  ),
};
