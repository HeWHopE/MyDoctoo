import type { Meta, StoryObj } from '@storybook/react';
import '@/index.css';
import Schedule from './Schedule';
import { useArgs } from '@storybook/preview-api';
import { Button } from '../Button/Button';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { useAppDispatch } from '@/app/hooks';
import { useEffect } from 'react';
import { getAppointmentsByPatientId } from '@/app/appointment/AppointmentThunks';
import dayjs from 'dayjs';
import { BrowserRouter } from 'react-router-dom';

const meta = {
  title: 'Components/UI/Schedule/Schedule',
  component: Schedule,
  parameters: {
    layout: 'start',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: any) => (
      <div className='flex h-screen w-screen overflow-hidden bg-background'>
        <Provider store={store}>
          <Story />
        </Provider>
      </div>
    ),
  ],
} satisfies Meta<typeof Schedule>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    scheduleInfo: {
      reviews: [],
      doctorId: '3',
      patientId: '7',
      doctor: {
        avatarKey: 'avatar',
        firstName: 'John',
        lastName: 'Doe',
        payrate: 100,
        rating: 4.5,
        reviewsCount: 10,
        about: 'About John Doe',
        specializations: [{ name: 'Dentist', id: '1' }],
        id: '',
        userId: '',
        email: '',
        phone: '',
        hospitals: [],
      },
    },
    scheduleIsOpen: true,
    closePopup: () => {},
    currentDay: dayjs('2024-04-28'),
  },

  render: function Render({ scheduleInfo, currentDay }) {
    const [{ scheduleIsOpen }, updateArgs] = useArgs();
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(getAppointmentsByPatientId('7'));
    }, [dispatch]);

    function closePopup() {
      updateArgs({ scheduleIsOpen: false });
    }

    function openPopup() {
      updateArgs({ scheduleIsOpen: true });
    }

    return (
      <BrowserRouter>
        <Button type='primary' onClick={openPopup}>
          Open Schedule Modal
        </Button>
        <Schedule
          currentDay={currentDay}
          scheduleInfo={scheduleInfo}
          scheduleIsOpen={scheduleIsOpen}
          closePopup={closePopup}
        />
      </BrowserRouter>
    );
  },
};
