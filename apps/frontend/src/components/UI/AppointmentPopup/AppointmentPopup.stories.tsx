import type { Meta, StoryObj } from '@storybook/react';
import '@/index.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import ReviewSlice from '@/app/review/ReviewSlice';
import { SchedulePopupProvider } from '@/hooks/popups/useSchedulePopup';
import { AppointmentPopupProvider, useAppointmentPopup } from '@/hooks/popups/useAppointmentPopup';
import AppointmentPopup from './AppointmentPopup';
import { Button } from '@/components/UI';
import { AppointmentStatus } from '@/dataTypes/Appointment';
import AppointmentSlice from '@/app/appointment/AppointmentSlice';

const mockAppointment = {
  id: '1',
  doctorId: 'doc1',
  patientId: 'pat1',
  createdAt: '2022-12-01T10:00:00.000Z',
  notes: 'This is a mock appointment',
  status: AppointmentStatus.CANCELED,
  videoRecordKey: 'video1',
  startedAt: '2022-12-01T10:00:00.000Z',
  endedAt: '2022-12-01T11:00:00.000Z',
  paymentInvoiceKey: 'invoice1',
  paymentReceiptKey: 'receipt1',
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
};

const mockStore = configureStore({
  reducer: {
    appointment: AppointmentSlice,
    review: ReviewSlice,
  },
  preloadedState: {
    appointment: {
      appointments: [],
      error: null,
      isLoading: false,
    },
    review: {
      reviews: [],
    },
  },
});

const meta: Meta<typeof AppointmentPopup> = {
  title: 'Components/UI/AppointmentsPopup',
  component: AppointmentPopup,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    Story => (
      <Provider store={mockStore}>
        <BrowserRouter>
          <SchedulePopupProvider>
            <AppointmentPopupProvider>
              <div className='flex h-screen w-screen overflow-hidden bg-background'>
                <main className='main-wrapper flex h-full w-full flex-col gap-6 overflow-auto p-8'>
                  <Story />
                </main>
              </div>
            </AppointmentPopupProvider>
          </SchedulePopupProvider>
        </BrowserRouter>
      </Provider>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    appointment: mockAppointment,
  },

  render: function Render({ appointment }) {
    const { openPopup } = useAppointmentPopup();
    return (
      <Button
        type='primary'
        onClick={() => {
          openPopup(appointment);
        }}
      >
        Open Pop Up
      </Button>
    );
  },
};
