import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchReviewsByDoctor } from '@/app/review/ReviewThunks';
import type { IAppointment } from '@/dataTypes/Appointment';
import AppointmentPopup from '@UI/AppointmentPopup/AppointmentPopup';
import React, { useContext, useEffect, useState } from 'react';

export type AppointmentPopupContextProps = {
  isPopupOpen: boolean;
  openPopup: (appointment: IAppointment | null) => void;
  closePopup: () => void;
  setAppointment: React.Dispatch<React.SetStateAction<IAppointment | null>>;
};

export const AppointmentPopupContext = React.createContext<AppointmentPopupContextProps | null>(null);

export const useAppointmentPopup = () => {
  const context = useContext(AppointmentPopupContext);
  if (!context) {
    throw new Error('useAppointmentPopup must be used within a AppointmentPopupProvider');
  }
  return context;
};

type AppointmentPopupProviderProps = {
  children: React.ReactNode;
};

export const AppointmentPopupProvider = ({ children }: AppointmentPopupProviderProps) => {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector(state => state.review.reviews);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [appointment, setAppointment] = useState<IAppointment | null>(null);

  useEffect(() => {
    if (appointment) {
      dispatch(fetchReviewsByDoctor({ doctorId: appointment.doctorId, includeNames: 'true', skip: '0', take: '2' }));
    }
  }, [appointment?.id]);

  const openPopup = (appointment: IAppointment | null) => {
    setAppointment(appointment);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <AppointmentPopupContext.Provider value={{ isPopupOpen, openPopup, closePopup, setAppointment }}>
      {children}

      <AppointmentPopup isOpen={isPopupOpen} onClose={closePopup} appointment={appointment} reviews={reviews} />
    </AppointmentPopupContext.Provider>
  );
};
