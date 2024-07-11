import { useArgs } from '@storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import '../../../index.css';
import { RadioButton } from './RadioButton';

const meta = {
  title: 'Components/UI/RadioButton',
  component: RadioButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    selected: {
      control: 'boolean',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof RadioButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'radiobutton',
    disabled: false,
    name: 'radiobutton',
    selected: false,
    id: 'radiobutton',
  },
  render: function Render(args) {
    const [{ selected, disabled }, updateArgs] = useArgs();

    function onClick() {
      updateArgs({ selected: !selected });
    }

    return <RadioButton {...args} onClick={onClick} disabled={disabled} />;
  },
};
