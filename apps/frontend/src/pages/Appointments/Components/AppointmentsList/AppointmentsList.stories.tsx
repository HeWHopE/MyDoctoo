import type { IAppointment } from '@/dataTypes/Appointment';
import { AppointmentStatus } from '@/dataTypes/Appointment';
import '@/index.css';
import { configureStore } from '@reduxjs/toolkit';
import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'react-redux';
import AppointmentSlice from '../../../../app/appointment/AppointmentSlice';
import AppointmentsList from './AppointmentsList';

const mockAppointments: IAppointment[] = [
  {
    id: '1',
    doctorId: 'doc1',
    patientId: 'pat1',
    createdAt: '2022-12-01T10:00:00.000Z',
    status: AppointmentStatus.CANCELED,
    notes: 'This is a mock appointment',
    paymentInvoiceKey: 'invoice1',
    paymentReceiptKey: 'receipt1',
    videoRecordKey: 'video1',
    startedAt: '2022-12-01T10:00:00.000Z',
    endedAt: '2022-12-01T10:00:00.000Z',
    doctor: {
      id: 'doc1',
      userId: 'user1',
      payrate: 100,
      about: 'This is a mock doctor',
      firstName: 'Mocking',
      lastName: 'Mock',
      avatarKey: 'https://i.pravatar.cc/300',
      email: 'dr.mock@example.com',
      phone: '+1234567890',
      rating: 4.5,
      reviewsCount: 30,
      specializations: [
        {
          id: 'spec1',
          name: 'Specialization1',
        },
      ],
      hospitals: [
        {
          id: 'hosp1',
          name: 'Mock Hospital',
          country: 'Mockland',
          state: 'Mock State',
          city: 'Mock City',
          street: '123 Mock Street',
          zipCode: 12345,
        },
      ],
    },
  },
];

const mockStore = configureStore({
  reducer: {
    appointment: AppointmentSlice,
  },
  preloadedState: {
    appointment: {
      appointments: mockAppointments,
      appointment: null,

      currentAppointments: [],
      doctorSchedules: {
        starts_work_hour_utc: 8,
        ends_work_hour_utc: 18,
      },
      todayAppointments: [],
      weekAppointments: [],
      error: null,
      isLoading: false,
    },
  },
});

const meta: Meta<typeof AppointmentsList> = {
  title: 'Pages/AppointmentsPage/AppointmentsList',
  component: AppointmentsList,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <Provider store={mockStore}>
        <Story />
      </Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AppointmentsList
      filters={{
        doctors: ['All doctors'],
        statuses: ['All statuses'],
        time: ['All time'],
        order: ['Oldest to latest'],
      }}
      appointments={[]}
    />
  ),
};
