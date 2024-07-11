import type { Meta, StoryObj } from '@storybook/react';
import AppointmentsWidget from './AppointmentsWidget';
import '@/index.css';
import dayjs from 'dayjs';

const meta: Meta<typeof AppointmentsWidget> = {
  title: 'Pages/CalendarPage/Components/AppointmentsWidget',
  component: AppointmentsWidget,
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
    appointmentsForDay: [
      {
        id: '4556456',
        doctorId: '45456',
        patientId: '456456',
        notes: 'Notes',
        doctor: {
          id: '456456',
          userId: '456465',
          payrate: 50,
          about: '',
          email: 'mail@gmail.com',
          phone: '+380999999999',
          hospitals: [
            {
              id: 'hospital_id',
              name: 'Hospital name',
              country: 'Norway',
              city: 'Oslo',
              street: 'Street',
              zipCode: 5000,
            },
          ],
          avatarKey: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_18.png',
          firstName: 'John',
          lastName: 'Doe',
          rating: 5,
          reviewsCount: 128,
          specializations: [{ id: '1', name: 'Cardiologist' }],
        },
        createdAt: dayjs().toDate().toISOString(),
        status: 'Planned',
        videoRecordKey: 'video record key',
        startedAt: Date(),
        endedAt: Date(),
      },
      {
        id: '4556456',
        doctorId: '45456',
        patientId: '456456',
        notes: 'Notes',
        doctor: {
          id: '456456',
          userId: '456465',
          payrate: 50,
          about: '',
          email: 'mail@gmail.com',
          phone: '+380999999999',
          hospitals: [
            {
              id: 'hospital_id',
              name: 'Hospital name',
              country: 'Norway',
              city: 'Oslo',
              street: 'Street',
              zipCode: 5000,
            },
          ],
          avatarKey: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_18.png',
          firstName: 'Beebee',
          lastName: 'Bubur',
          rating: 5,
          reviewsCount: 128,
          specializations: [{ id: '1', name: 'Cardiologist' }],
        },
        createdAt: dayjs().toDate().toISOString(),
        status: 'Planned',
        videoRecordKey: 'video record key',
        startedAt: Date(),
        endedAt: Date(),
      },
    ],
    selectedDate: dayjs().toDate(),
  },
};

export const NoAppointments: Story = {
  args: {
    appointmentsForDay: [],
    selectedDate: dayjs().toDate(),
  },
};
