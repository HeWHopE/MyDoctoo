import type { Meta, StoryObj } from '@storybook/react';
import Spinner from './Spinner';

const meta = {
  title: 'Example/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },

  argTypes: {
    size: {
      control: { type: 'number' },
      defaultValue: 40,
    },
    color: {
      control: { type: 'color' },
      defaultValue: '#707D7E',
    },
  },
  args: { size: 40, color: '#707D7E' },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 50,
    color: '#707D7E',
  },
};
