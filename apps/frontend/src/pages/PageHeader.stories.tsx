import { Button } from '@/components/UI/Button/Button';
import '@/index.css';
import type { Meta, StoryObj } from '@storybook/react';
import PageHeader from './PageHeader';

const meta = {
  title: 'Components/PageHeader',
  component: PageHeader,
  parameters: {
    layout: 'start',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className='w-full p-8'>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PageHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    iconVariant: 'dashboard',
    title: 'Dashboard',
  },
  render: args => (
    <PageHeader {...args}>
      <Button type='primary' onClick={() => {}}>
        Test
      </Button>
      <Button type='secondary' onClick={() => {}}>
        Test
      </Button>
    </PageHeader>
  ),
};
