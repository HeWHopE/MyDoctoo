import LoginPage from '@/pages/auth/login/LoginPage';
import type { StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router';

const meta = {
  title: 'Pages/AuthPage/Login',
  component: LoginPage,
};

export default meta;
type Story = StoryObj<typeof LoginPage>;

export const Default: Story = {
  args: {},
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};
