import type { Meta, StoryObj } from '@storybook/react';
import Popup from './Popup';
import '@/index.css';
import { Button } from '../Button/Button';
import { useArgs } from '@storybook/preview-api';

const meta: Meta<typeof Popup> = {
  title: 'Components/UI/Popup',
  component: Popup,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <div className='flex h-screen w-screen overflow-hidden bg-background'>
        <main className='main-wrapper flex h-full w-full flex-col gap-6 overflow-auto p-8'>
          <Story />
        </main>
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    popupIsOpen: false,
    closePopup: () => {},
  },
  render: function Render() {
    const [{ popupIsOpen }, updateArgs] = useArgs();

    function closePopup() {
      updateArgs({ popupIsOpen: false });
    }

    function openPopup() {
      updateArgs({ popupIsOpen: true });
    }

    return (
      <>
        <Button type='primary' onClick={openPopup}>
          Open Pop Up
        </Button>
        <Popup popupIsOpen={popupIsOpen} closePopup={closePopup} modalBodyClassName='flex flex-col'>
          <div className='flex flex-col gap-y-6'>
            <h1>I am a Pop up</h1>
            <h1>Click on a backdrop, or an X button in the top right corner, to close me</h1>
            <h1>Also, all of my classes are customizable: close button, body and full modal window</h1>
            <h1>Simply, put some children inside of me and be happy</h1>
            <h1>I become taller with more content inside of me, but I remain in center of a screen nontheless</h1>
          </div>
        </Popup>
      </>
    );
  },
};
