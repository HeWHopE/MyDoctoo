import { useAppSelector } from '@/app/hooks';
import { Button, ImgAvatarKey } from '@/components/UI';
import Schedule from '@/components/UI/Schedule/Schedule';
import type { IDoctor } from '@/dataTypes/Doctor';
import { capitalizeString } from '@/utils/capitalizeString';
import { useState } from 'react';

export default function DoctorCard({ doctor }: { doctor: IDoctor }) {
  const { firstName, lastName, avatarKey } = doctor;

  const patient = useAppSelector(state => state.patient.data);

  const reviews = useAppSelector(state => state.review.reviews);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='flex h-fit w-full items-center justify-between rounded-lg bg-white p-5'>
      <div className='flex h-fit items-center justify-center gap-4'>
        <ImgAvatarKey avatarKey={avatarKey} className='aspect-square w-12 shrink-0 rounded' />
        <div className='font-medium text-black'>
          {capitalizeString(firstName ?? '')} {capitalizeString(lastName ?? '')} (
          {capitalizeString(doctor.specializations[0].name)})
        </div>
      </div>

      <Button
        type='primary'
        onClick={() => setIsOpen(true)}
        className='bg-main-dark transition-colors duration-300 hover:bg-main'
      >
        Book
      </Button>
      <Schedule
        scheduleIsOpen={isOpen}
        closePopup={() => setIsOpen(false)}
        scheduleInfo={{
          patientId: patient.id,
          doctorId: doctor.id,
          doctor,
          reviews: reviews,
        }}
      />
    </div>
  );
}
