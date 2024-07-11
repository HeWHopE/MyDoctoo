import type { Dayjs } from 'dayjs';
import PopupDoctoo from '../Popup/Popup';
import ScheduleAbout from './ScheduleAbout';
import ScheduleBook from './ScheduleBook';
import ScheduleHeader from './ScheduleHeader';
import ScheduleTestimonials from './ScheduleTestimonials';
import dayjs from 'dayjs';
import ScheduleSuccessModal from './ScheduleSuccessModal';
import { useState } from 'react';
import type { IDoctor } from '@/dataTypes/Doctor';
import type { IReview } from '@/dataTypes/Review';

export type ScheduleInfoProps = {
  patientId: string;
  appointmentId?: string;
  doctorId: string | null;
  doctor: IDoctor | null;
  reviews: IReview[];
};

export type ScheduleProps = {
  closePopup: () => void;
  scheduleIsOpen: boolean;
  scheduleInfo: ScheduleInfoProps;
  currentDay?: Dayjs;
  rescheduling?: boolean;
};

export default function Schedule({
  scheduleInfo,
  closePopup,
  scheduleIsOpen,
  currentDay = dayjs(),
  rescheduling,
}: ScheduleProps) {
  const { doctorId, patientId, appointmentId, doctor, reviews } = scheduleInfo;
  if (!doctor || !doctorId) return null;

  const { avatarKey, firstName, lastName, payrate, rating, reviewsCount, about, specializations } = doctor;

  const doctorFullName = `Dr. ${firstName} ${lastName}`;

  const [appointmentSelectedDate, setAppointmentSelectedDate] = useState<Dayjs | undefined>(undefined);
  const [successfullModal, setSuccessfullModal] = useState(false);

  function openSuccessulModal() {
    setSuccessfullModal(true);
  }

  const firstSpecializationName = specializations.length > 0 ? specializations[0].name : 'Doctor';

  return (
    <>
      <PopupDoctoo
        popupIsOpen={scheduleIsOpen}
        closePopup={closePopup}
        modalBodyClassName='flex flex-col gap-y-6'
        modalFullClassName='p-8 max-w-[700px] max-h-[700px] overflow-y-auto'
      >
        <ScheduleHeader
          fullName={doctorFullName}
          avatar={avatarKey}
          payrate={payrate}
          rating={rating}
          reviewsCount={reviewsCount}
          doctorId={doctorId}
          specialization={specializations && firstSpecializationName}
        />

        <ScheduleBook
          currentDay={currentDay}
          doctorId={doctorId}
          patientId={patientId}
          closePopup={closePopup}
          appointmentId={appointmentId}
          rescheduling={rescheduling}
          openSuccessulModal={openSuccessulModal}
          setAppointmentSelectedDate={setAppointmentSelectedDate}
        />

        <ScheduleAbout about={about} />

        <ScheduleTestimonials reviews={reviews} doctorId={doctorId} />
      </PopupDoctoo>

      {appointmentSelectedDate && (
        <ScheduleSuccessModal
          popupIsOpen={successfullModal}
          closePopup={() => setSuccessfullModal(false)}
          date={appointmentSelectedDate}
        />
      )}
    </>
  );
}
