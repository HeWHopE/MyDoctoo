import type { StoryObj } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import SignUpPage from './SignUpPage';

const meta = {
  title: 'Pages/AuthPage/SignUpPage',
  component: SignUpPage,
};

export default meta;
type Story = StoryObj<typeof SignUpPage>;

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
