import type { Meta, StoryObj } from '@storybook/react';
import NearestAppointmentsComponent from './NearestAppointments';
import { AppointmentStatus } from '@/dataTypes/Appointment';

const meta: Meta<typeof NearestAppointmentsComponent> = {
  title: 'Pages/DashboardPage/Components/NearestAppointments',
  component: NearestAppointmentsComponent,
  decorators: [Story => <Story />],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const WithAppointments: Story = {
  args: {
    appointments: [
      {
        id: '1',
        doctor: {
          about: 'Cardiologist',
          firstName: 'Elison',
          lastName: 'Mur',
          phone: '',
          email: '',
          avatarKey: 'https://cdn.jsdelivr.net/gh/alohe/avatars@master/png/vibrent_9.png',
          specializations: [],
          hospitals: [],
          id: '',
          userId: '',
          payrate: 0,
          rating: 4.5,
          reviewsCount: 30,
        },
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        doctorId: '',
        patientId: '',
        createdAt: new Date().toISOString(),
        notes: '',
        status: AppointmentStatus.PLANNED,
        videoRecordKey: '',
        paymentInvoiceKey: '',
        paymentReceiptKey: '',
      },
      {
        id: '1',
        doctor: {
          about: 'Cardiologist',
          firstName: 'Elison',
          lastName: 'Mur',
          phone: '',
          email: '',
          avatarKey: 'https://cdn.jsdelivr.net/gh/alohe/avatars@master/png/vibrent_9.png',
          specializations: [],
          hospitals: [],
          id: '',
          userId: '',
          payrate: 0,
          rating: 4.5,
          reviewsCount: 30,
        },
        startedAt: new Date().toISOString(),
        endedAt: new Date().toISOString(),
        doctorId: '',
        patientId: '',
        createdAt: new Date().toISOString(),
        notes: '',
        status: AppointmentStatus.PLANNED,
        videoRecordKey: '',
        paymentInvoiceKey: '',
        paymentReceiptKey: '',
      },
    ],
  },
};

export const WithoutgAppointment: Story = {
  args: {},
};
