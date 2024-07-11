import type { Meta, StoryObj } from '@storybook/react';
import '@/index.css';
import ScheduleBook from './ScheduleBook';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { useAppDispatch } from '@/app/hooks';
import { useEffect } from 'react';
import { getAppointmentsByPatientId } from '@/app/appointment/AppointmentThunks';
import dayjs from 'dayjs';
import { BrowserRouter } from 'react-router-dom';

const meta = {
  title: 'Components/UI/Schedule/ScheduleBook',
  component: ScheduleBook,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story: any) => (
      <BrowserRouter>
        <Provider store={store}>
          <div className='flex h-screen w-[700px] p-12'>
            <Story />
          </div>
        </Provider>
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof ScheduleBook>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    doctorId: '3',
    patientId: '7',
    closePopup: () => {},
    currentDay: dayjs('2024-04-28'),
    openSuccessulModal: () => {},
    setAppointmentSelectedDate: () => {},
  },
  render: function Render({ patientId, currentDay }) {
    const dispatch = useAppDispatch();

    useEffect(() => {
      dispatch(getAppointmentsByPatientId(patientId));
    }, [dispatch]);

    return (
      <ScheduleBook
        currentDay={currentDay}
        doctorId='3'
        patientId='7'
        closePopup={() => {}}
        openSuccessulModal={() => {}}
        setAppointmentSelectedDate={() => {}}
      />
    );
  },
};
