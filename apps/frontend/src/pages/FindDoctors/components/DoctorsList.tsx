import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchReviewsByDoctor } from '@/app/review/ReviewThunks';
import { DoctorCard } from '@UI/index';
import type { IDoctor } from '@/dataTypes/Doctor';
import { NoResults } from './NoResults';
import { generateDoctorTags } from '@/utils/generateDoctorTags';
import type { OpenSchedulePopupProps } from '@/hooks/popups/useSchedulePopup';
import { useSchedulePopup } from '@/hooks/popups/useSchedulePopup';

type DoctorsListProps = {
  doctors: IDoctor[];
};

export const DoctorsList = ({ doctors }: DoctorsListProps) => {
  const { openPopup, setScheduleInfo } = useSchedulePopup();

  const patient = useAppSelector(state => state.patient.data);
  const dispatch = useAppDispatch();
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const reviews = useAppSelector(state => state.review.reviews);

  useEffect(() => {
    if (!selectedDoctorId) return;
    dispatch(fetchReviewsByDoctor({ doctorId: selectedDoctorId, take: '2', skip: '0', includeNames: 'true' }));
  }, [selectedDoctorId]);

  useEffect(() => {
    setScheduleInfo((prevInfo: OpenSchedulePopupProps) => ({
      ...prevInfo,
      scheduleInfo: {
        ...prevInfo.scheduleInfo,
        reviews: reviews,
      },
    }));
  }, [reviews]);

  const openSchedulePopup = (doctor: IDoctor) => {
    setSelectedDoctorId(doctor.id);
    openPopup({
      scheduleInfo: {
        patientId: patient.id,
        doctorId: doctor.id,
        doctor,
        reviews,
      },
    });
  };

  return (
    <div className='mt-2 w-full xl:mt-4'>
      {doctors.length ? (
        doctors.map(doctor => (
          <>
            <DoctorCard key={doctor.id} className='my-4'>
              <DoctorCard.ImageWithFavorite
                alt={doctor.firstName + ' ' + doctor.lastName}
                isFavorite={doctor.isFavorite!}
                url={doctor.avatarKey}
                doctorId={doctor.id}
              />
              <DoctorCard.Name>
                {doctor.firstName} {doctor.lastName}
              </DoctorCard.Name>
              <DoctorCard.Specializations specializations={doctor.specializations} />
              <DoctorCard.Tags
                wrapperClassName='lg:col-span-2 xl:col-span-1'
                tags={generateDoctorTags({ schedule: doctor.schedule, rating: doctor.rating })}
              />
              <DoctorCard.Rating rating={doctor.rating} reviewsCount={doctor.reviewsCount} doctorId={doctor.id} />
              <DoctorCard.PayrateLabel
                className='lg:col-start-2 lg:row-span-1 lg:row-start-3 lg:text-left xl:col-start-3 xl:row-start-1 xl:text-right'
                payrate={doctor.payrate}
              />
              <DoctorCard.TimeSlots
                wrapperClassName='lg:col-span-full lg:col-start-1 lg:mt-1 lg:row-start-6 xl:col-start-3 xl:row-span-3 xl:row-start-2 xl:mt-0'
                slotButtonClassName='lg:w-full xl:w-28'
                timestamps={doctor.schedule?.timeslots?.map(slot => new Date(slot.timestamp)) || []}
                onClickMore={() => {
                  openSchedulePopup(doctor);
                }}
                onClickSlot={() => {
                  openSchedulePopup(doctor);
                }}
              />
            </DoctorCard>
          </>
        ))
      ) : (
        <NoResults />
      )}
    </div>
  );
};
