import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getAppointment } from '@/app/appointment/AppointmentThunks';
import { PaymentForm } from './component/PaymentForm';
import { ErrorMessage } from './component/ErrorMessage';
import { AppointmentStatus } from '@/dataTypes/Appointment';
import PatientDashboardSkeleton from '../dashboard/components/PatientDashboard/PatientDashboardSkeleton';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_API_KEY);

export const PaymentPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const appointmentData = useAppSelector(state => state.appointment.appointment);

  const isDataLoaded = appointmentData !== null;
  const isPendingPayment = appointmentData && appointmentData.status === AppointmentStatus.PENDING_PAYMENT;

  useEffect(() => {
    const fetchAppointment = async () => {
      setIsLoading(true);
      try {
        const appointmentId = location.pathname.split('/').pop();
        if (appointmentId) {
          await dispatch(getAppointment(appointmentId));
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    fetchAppointment();
  }, [dispatch, location]);

  return (
    <div>
      {isLoading && <PatientDashboardSkeleton />}
      {!isLoading && isDataLoaded ? (
        isPendingPayment ? (
          <Elements stripe={stripePromise}>
            <PaymentForm />
          </Elements>
        ) : (
          <ErrorMessage message='This appointment has already been paid for. Please try another one.' />
        )
      ) : (
        <ErrorMessage message='Unfortunately, the appointment you want to pay for does not exist. Please try again.' />
      )}
    </div>
  );
};
