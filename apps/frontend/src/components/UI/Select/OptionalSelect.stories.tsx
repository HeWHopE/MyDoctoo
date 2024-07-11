import '@/index.css';

import type { Meta, StoryObj } from '@storybook/react';
import { useEffect, useState } from 'react';
import OptionalSelect from './OptionalSelect';

const meta: Meta<typeof OptionalSelect> = {
  title: 'Components/UI/OptionalSelect',
  component: OptionalSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render() {
    const [chosenOptions, setChosenOptions] = useState<string[]>([]);

    const [options, setOptions] = useState<{ id: string; name: string }[]>([]);

    console.log('chosenOptions', chosenOptions);

    useEffect(() => {
      setOptions([
        { id: '1', name: 'Doctor 1' },
        { id: '2', name: 'Doctor 2' },
        { id: '3', name: 'Doctor 3' },
        { id: '4', name: 'Doctor 4' },
        { id: '5', name: 'Doctor 5' },
        { id: '6', name: 'Doctor 6' },
      ]);
    }, []);

    return (
      <>
        <OptionalSelect options={options} defaultOption='All doctors' setChosenOptions={setChosenOptions} />
      </>
    );
  },
};
