import type { Meta, StoryObj } from '@storybook/react';
import AppointmentCard from './AppointmentCard';
import { AppointmentStatus } from '@/dataTypes/Appointment';

const meta: Meta<typeof AppointmentCard> = {
  title: 'Pages/DashboardPage/Components/AppointmentCard',
  component: AppointmentCard,
  decorators: [Story => <Story />],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const FutureAppointment: Story = {
  args: {
    appointment: {
      id: '10',
      patientId: '7',
      doctorId: '3',
      createdAt: '2024-04-23T00:00:00.000Z',
      status: AppointmentStatus.PLANNED,
      notes: 'Regular check-up',
      paymentInvoiceKey: 'INV-2024-00123',
      paymentReceiptKey: 'REC-2024-04567',
      videoRecordKey: 'ss',
      doctor: {
        userId: '1',
        id: '3',
        payrate: 150,
        about: 'Experienced physician',
        firstName: 'John',
        lastName: 'Doe',
        avatarKey: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_18.png',
        phone: '0966984497',
        email: 'john.doe@example.com',
        specializations: [],
        hospitals: [],
        rating: 4.5,
        reviewsCount: 30,
      },
      startedAt: '2024-04-23T00:00:00.000Z',
      endedAt: '2024-04-23T00:00:00.000Z',
    },
  },
};

export const IncomingAppointment: Story = {
  args: {
    appointment: {
      id: '10',
      patientId: '7',
      doctorId: '3',
      createdAt: '2024-04-23T00:00:00.000Z',
      status: AppointmentStatus.CANCELED,
      notes: 'Regular check-up',
      paymentInvoiceKey: 'INV-2024-00123',
      paymentReceiptKey: 'REC-2024-04567',
      videoRecordKey: 'ss',
      doctor: {
        id: '3',
        userId: '1',
        payrate: 150,
        about: 'Experienced physician',
        firstName: 'John',
        lastName: 'Doe',
        avatarKey: 'https://cdn.jsdelivr.net/gh/alohe/avatars/png/vibrent_18.png',
        phone: '0966984497',
        email: 'john.doe@example.com',
        specializations: [],
        hospitals: [],
        rating: 4.5,
        reviewsCount: 30,
      },
      startedAt: '2024-04-23T00:00:00.000Z',
      endedAt: '2024-04-23T00:00:00.000Z',
    },
  },
};
