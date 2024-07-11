import type { Meta } from '@storybook/react';
import { fn } from '@storybook/test';
import Settings from './settingsPage';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';

const meta = {
  title: 'Example/Settings',
  component: Settings,

  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Settings>;

export default meta;

export const Default = () => {
  return (
    <Provider store={store}>
      <Settings />
    </Provider>
  );
};
