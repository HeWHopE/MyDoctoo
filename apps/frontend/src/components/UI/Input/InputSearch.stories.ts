import type { Meta, StoryObj } from '@storybook/react';
import InputSearch from './InputSearch';

const meta: Meta<typeof InputSearch> = {
  title: 'Components/UI/InputSearch',
  component: InputSearch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const SearchInputGrey: Story = {
  args: {
    variant: 'grey',
    placeholder: 'Search',
    className: 'w-72',
  },
};
export const SearchInputWhite: Story = {
  args: {
    variant: 'white',
    placeholder: 'Search by doctor, sympthom',
    className: 'w-96',
  },
};
