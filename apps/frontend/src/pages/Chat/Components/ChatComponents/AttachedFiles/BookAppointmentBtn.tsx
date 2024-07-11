import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getFamilyDoctor } from '@/app/doctor/DoctorThunks';
import { fetchReviewsByDoctor } from '@/app/review/ReviewThunks';
import { useSchedulePopup } from '@/hooks/popups/useSchedulePopup';
import { Button } from '@UI/index';

const BookAppointmentBtn = () => {
  const dispatch = useAppDispatch();
  const doctorUser = useAppSelector(state => state.doctor.familyDoctor);
  const reviews = useAppSelector(state => state.review.reviews);
  const openedChat = useAppSelector(state => state.chat.openedChat);
  const { openPopup } = useSchedulePopup();

  useEffect(() => {
    if (openedChat) {
      dispatch(getFamilyDoctor(openedChat.doctorId));
      dispatch(fetchReviewsByDoctor({ doctorId: openedChat.doctorId, includeNames: 'true' }));
    }
  }, [openedChat]);

  function openSchedulePopup() {
    if (!openedChat) return;
    openPopup({
      scheduleInfo: {
        patientId: openedChat.patientId,
        doctorId: openedChat.doctorId,
        doctor: doctorUser,
        reviews: reviews,
      },
    });
  }

  return (
    <div className='sticky bottom-0 bg-white p-6'>
      <Button btnType='button' type='primary' className='w-full' onClick={openSchedulePopup}>
        Book appointment
      </Button>
    </div>
  );
};

export default BookAppointmentBtn;
