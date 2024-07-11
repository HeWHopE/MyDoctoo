import type { IAppointment } from '@/dataTypes/Appointment';
import PopupBody from './PopupBody';
import PopupHeader from './PopupHeader';
import AppointmentButtons from '@/pages/Appointments/Components/AppointmentsList/ItemButtons';
import AppointmentLinks from '@/pages/Appointments/Components/AppointmentsList/ItemLinks';
import type { IReview } from '@/dataTypes/Review';
import useWindowWide from '@/hooks/useWindowWide';
import { useSchedulePopup } from '@/hooks/popups/useSchedulePopup';
import { PopupDoctoo } from '@UI/index';

type AppointmentPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment: IAppointment | null;
  reviews: IReview[];
};

export default function AppointmentPopup({ isOpen, onClose, appointment, reviews }: AppointmentPopupProps) {
  const { openPopup } = useSchedulePopup();

  const tabletWidth = useWindowWide(824);
  const mobileWidth = useWindowWide(500);

  if (!appointment) return null;

  const { doctor, startedAt, status, videoRecordKey, notes, patientId, doctorId } = appointment;

  function openSchedule(isRescheduling: boolean = false) {
    openPopup({
      scheduleInfo: {
        patientId: patientId,
        doctorId: doctorId,
        doctor: doctor!,
        reviews: reviews,
      },
      rescheduling: isRescheduling,
    });
  }

  return (
    <PopupDoctoo popupIsOpen={isOpen} closePopup={onClose} modalFullClassName='max-w-[700px]'>
      <div className='flex flex-col justify-between gap-y-8'>
        <div className='flex flex-col gap-y-4'>
          <PopupHeader startTime={startedAt} status={status} />
          {doctor && (
            <PopupBody
              openReschedule={() => {
                openSchedule(true);
              }}
              doctorId={doctorId}
              status={status}
              doctor={doctor}
            />
          )}
        </div>

        {videoRecordKey && notes && (
          <div className={`flex items-center ${tabletWidth ? 'justify-between' : 'mt-2 gap-x-2'}`}>
            <span className={`font-normal text-grey-2 `}>Attached files:</span>

            <div className='self-end'>
              <AppointmentLinks videoRecordKey={videoRecordKey} notes={notes} />
            </div>
          </div>
        )}

        <div className={`flex gap-x-4 ${mobileWidth ? 'self-end' : 'self-center'}`}>
          <AppointmentButtons
            componentName='popup'
            appointment={appointment}
            openBookModal={openSchedule}
            closePopup={onClose}
          />
        </div>
      </div>
    </PopupDoctoo>
  );
}
