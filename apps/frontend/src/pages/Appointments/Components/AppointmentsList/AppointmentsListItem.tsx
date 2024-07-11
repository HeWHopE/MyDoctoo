import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchReviewsByDoctor } from '@/app/review/ReviewThunks';
import type { OpenSchedulePopupProps } from '@/hooks/popups/useSchedulePopup';
import { useSchedulePopup } from '@/hooks/popups/useSchedulePopup';
import type { IAppointment } from '@/dataTypes/Appointment';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Icon } from '@UI/index';
import AppointmentLinks from './ItemLinks';
import AppointmentBadges from './ItemBadges';
import AppointmentButtons from './ItemButtons';
import { useAppointmentPopup } from '@/hooks/popups/useAppointmentPopup';

dayjs.extend(utc);

type AppointmentsListItemProps = { appointment: IAppointment };

export default function AppointmentsListItem({ appointment }: AppointmentsListItemProps) {
  const dispatch = useAppDispatch();
  const reviews = useAppSelector(state => state.review.reviews);

  const { patientId, doctorId, doctor, videoRecordKey, notes, status, paymentReceiptKey, startedAt } = appointment;
  const { firstName, lastName, specializations } = doctor!;
  const fullName = `Dr. ${firstName} ${lastName}`;

  const firstSpecializationName = specializations.length > 0 ? specializations[0].name : 'Doctor';

  const { openPopup, setScheduleInfo } = useSchedulePopup();

  useEffect(() => {
    setScheduleInfo((prevInfo: OpenSchedulePopupProps) => ({
      ...prevInfo,
      scheduleInfo: {
        ...prevInfo.scheduleInfo,
        reviews: reviews,
      },
    }));
  }, [reviews]);

  function openBookModal() {
    dispatch(fetchReviewsByDoctor({ doctorId: appointment.doctorId, includeNames: 'true', skip: '0', take: '2' }));
    openPopup({
      scheduleInfo: {
        patientId: patientId,
        doctorId: doctorId,
        doctor: doctor!,
        reviews: reviews,
      },
    });
  }

  const { openPopup: openAppointmentPopup, closePopup: closeAppointmentPopup } = useAppointmentPopup();

  function openModal(appointment: IAppointment): void {
    openAppointmentPopup(appointment);
  }

  return (
    <>
      <div
        className='flex flex-1 cursor-pointer flex-col justify-between gap-4 rounded-xl bg-white p-2 hover:ring-1 hover:ring-main sm:p-6'
        onClick={() => openModal(appointment)}
      >
        <div className='flex flex-wrap items-start justify-between gap-2'>
          <div className='flex flex-col gap-y-2'>
            <div className='flex gap-x-2'>
              <Icon variant='date' className='h-6 w-6 text-main' />
              <span className='text-lg font-semibold leading-6 text-black'>
                {dayjs.utc(startedAt, 'H:mm').format('MMMM D, h:mm a')}
              </span>
            </div>
            <p className='text-base font-medium text-black'>
              {fullName} ({firstSpecializationName})
            </p>
            <div className='flex gap-x-3 gap-y-4'>
              <AppointmentBadges paymentReceiptKey={paymentReceiptKey} status={status} />
            </div>
          </div>

          <div className='flex flex-col justify-between' onClick={e => e.stopPropagation()}>
            <div className='flex w-[140px] flex-col gap-x-2 gap-y-4 self-end'>
              <AppointmentButtons
                componentName='listItem'
                appointment={appointment}
                openBookModal={openBookModal}
                closePopup={closeAppointmentPopup}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-between'>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <p className='text-base font-normal text-grey-2'>Attached files:</p>
            <AppointmentLinks videoRecordKey={videoRecordKey} notes={notes} />
          </div>
        </div>
      </div>
    </>
  );
}
