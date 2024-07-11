import { AppointmentStatus } from '@prisma/client';

export const appointmentStub = () => {
  return {
    createdAt: '2024-04-29T07:58:54.171Z',
    status: AppointmentStatus.PLANNED,
    notes: '',
    paymentInvoiceKey: '3cc2c795-323c-49e0-aee4-489874f68da6',
    paymentReceiptKey: '1774940e-b34f-47c2-a5d6-0b7e221a3f8d',
    price: 500,
    startedAt: '2024-04-29T07:50:50.171Z',
    endedAt: '2024-04-29T08:50:50.171Z',
  };
};
