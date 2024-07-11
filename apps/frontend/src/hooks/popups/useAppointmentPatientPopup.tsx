import type { TAppointment } from '@/dataTypes/Appointment';
import AppointmentPatientPopup from '@UI/AppointmentPopup/AppointmentPatientPopup';
import React, { useContext, useState } from 'react';

type AppointmentPatientPopupContextType = {
  isOpen: boolean;
  openPopup: (appointment: TAppointment) => void;
  closePopup: () => void;
};

export const AppointmentPatientPopupContext = React.createContext<AppointmentPatientPopupContextType | null>(null);

export const useAppointmentPatientPopup = () => {
  const context = useContext(AppointmentPatientPopupContext);

  if (!context) {
    throw new Error('useAppointmentPatientPopup must be used within a AppointmentPatientPopupProvider');
  }

  return context;
};

const AppointmentPatientPopupProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [appointment, setAppointment] = useState<TAppointment | null>(null);

  const openPopup = (appointment: TAppointment) => {
    setAppointment(appointment);
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  return (
    <AppointmentPatientPopupContext.Provider value={{ isOpen, openPopup, closePopup }}>
      {children}
      <AppointmentPatientPopup popupIsOpen={isOpen} closePopup={closePopup} appointment={appointment} />
    </AppointmentPatientPopupContext.Provider>
  );
};

export default AppointmentPatientPopupProvider;
