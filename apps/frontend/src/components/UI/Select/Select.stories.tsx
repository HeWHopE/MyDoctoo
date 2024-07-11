import '@/index.css';

import type { Meta, StoryObj } from '@storybook/react';
import Select from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },

  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: 'mySelect',
    options: ['Option 1', 'Option 2', 'Option 3'],
  },
  render: function Render() {
    return (
      <>
        <Select id='mySelect' label='Select' options={['Option 1', 'Option 2', 'Option 3']} />
      </>
    );
  },
};
