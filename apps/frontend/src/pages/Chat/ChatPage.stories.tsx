import { BrowserRouter as Router } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import ChatPage from './ChatPage';
import '@/index.css';
import Sidemenu from '@/components/Sidemenu/Sidemenu';

const meta: Meta<typeof ChatPage> = {
  title: 'Pages/ChatPage/ChatPage',
  component: ChatPage,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <Provider store={store}>
        <Router>
          <div className='flex h-screen w-screen overflow-hidden bg-background'>
            <Sidemenu />
            <main className='main-wrapper flex h-full w-full flex-col gap-6 overflow-auto p-8'>
              <Story />
            </main>
          </div>
        </Router>
      </Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
