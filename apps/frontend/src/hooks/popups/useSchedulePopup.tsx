import type { ScheduleProps } from '@UI/Schedule/Schedule';
import Schedule from '@UI/Schedule/Schedule';
import React, { useContext, useState } from 'react';

export type SchedulePopupContextProps = {
  isPopupOpen: boolean;
  openPopup: (object: OpenSchedulePopupProps) => void;
  closePopup: () => void;
  setScheduleInfo: React.Dispatch<React.SetStateAction<OpenSchedulePopupProps>>;
};

export const SchedulePopupContext = React.createContext<SchedulePopupContextProps>({
  isPopupOpen: false,
  openPopup: () => {},
  closePopup: () => {},
  setScheduleInfo: () => {},
});

export const useSchedulePopup = () => {
  const context = useContext(SchedulePopupContext);
  if (!context) {
    throw new Error('useSchedulePopup must be used within a SchedulePopupProvider');
  }
  return context;
};

type SchedulePopupProviderProps = {
  children: React.ReactNode;
};

export type OpenSchedulePopupProps = Omit<ScheduleProps, 'scheduleIsOpen' | 'closePopup'>;

export const SchedulePopupProvider = ({ children }: SchedulePopupProviderProps) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [scheduleInfo, setScheduleInfo] = useState<OpenSchedulePopupProps>({
    scheduleInfo: {
      patientId: '',
      doctorId: null,
      doctor: null,
      reviews: [],
    },
  });

  const openPopup = (object: OpenSchedulePopupProps) => {
    setScheduleInfo(object);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <SchedulePopupContext.Provider value={{ isPopupOpen, openPopup, closePopup, setScheduleInfo }}>
      {children}

      <Schedule scheduleIsOpen={isPopupOpen} closePopup={closePopup} {...scheduleInfo} />
    </SchedulePopupContext.Provider>
  );
};
