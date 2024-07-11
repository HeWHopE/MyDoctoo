import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/app/store';
import { PaymentPage } from './PaymentPage';
import { setPaymentData } from '@/app/payment/paymentSlice';

const meta: Meta<typeof PaymentPage> = {
  title: 'Pages/PaymentPage',
  component: PaymentPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    store.dispatch(
      setPaymentData({
        data: {
          appointmentId: 'mockedAppointmentId',
          status: 'planned',
          date: '2024-05-01T14:00:00.000Z',
          doctorName: 'Dr. John Doe',
          doctorSpecialization: [{ id: 'mockedId', name: 'Surgeon' }],
          appointmentDuration: 1,
          pricePerHour: 150,
        },
      }),
    );

    return (
      <BrowserRouter>
        <Provider store={store}>
          <section className='bg-background p-12'>
            <PaymentPage />
          </section>
        </Provider>
      </BrowserRouter>
    );
  },
};
