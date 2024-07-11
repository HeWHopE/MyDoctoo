import '@/index.css';
import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Toggle } from './Toggle';

const meta: Meta<typeof Toggle> = {
  title: 'Components/UI/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    selected: {
      control: 'boolean',
    },
  },
  tags: ['autodocs'],
  args: { onSelectedChange: fn() },
};

export default meta;
type Story = StoryObj<typeof meta>;

const render = (args: any) => {
  const [{ selected }, updateArgs] = useArgs();

  function onClick() {
    updateArgs({ selected: !selected });
  }

  return <Toggle {...args} onSelectedChange={onClick} selected={selected} />;
};

export const Selected: Story = {
  args: {
    label: 'Toggle',
    id: 'toggle',
    selected: true,
  },
  render,
};

export const Unselected: Story = {
  args: {
    label: 'Toggle',
    id: 'toggle',
    selected: false,
  },
  render,
};
