import type { Meta, StoryObj } from '@storybook/react';
import SettingsPopup from './settingsPopup';
const meta = {
  title: 'Example/SettingsPopup',
  component: SettingsPopup,
} satisfies Meta<typeof SettingsPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    showPopup: true,
    handleClosePopup: () => {},
  },
};
