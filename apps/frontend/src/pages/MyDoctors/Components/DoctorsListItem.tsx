import { useAppSelector } from '@/app/hooks';
import { DoctorCard } from '@UI/index';
import { useSchedulePopup } from '@/hooks/popups/useSchedulePopup';
import type { IDoctor } from '@/dataTypes/Doctor';
import type { IAppointment } from '@/dataTypes/Appointment';

interface DoctorsListItemProps {
  key: string;
  doctor: IDoctor;
  appointments: IAppointment[];
}

const DoctorsListItem = ({ key, doctor }: DoctorsListItemProps) => {
  const patient = useAppSelector(state => state.patient.data);

  const { openPopup } = useSchedulePopup();

  function openSchedulePopup() {
    openPopup({
      scheduleInfo: {
        patientId: patient.id,
        doctorId: doctor.id,
        doctor,
        reviews: [],
      },
    });
  }

  const fullName = `Dr. ${doctor.firstName} ${doctor.lastName}`;

  return (
    <div key={key}>
      <DoctorCard>
        <DoctorCard.Image url={doctor.avatarKey} className='min-h-[70]' />
        <DoctorCard.Name>{fullName}</DoctorCard.Name>
        <DoctorCard.Specializations
          specializations={doctor.specializations ? doctor.specializations : []}
          className='overflow-hidden text-ellipsis'
        />
        <DoctorCard.Tags tags={[]} />
        <DoctorCard.Rating rating={doctor.rating} reviewsCount={doctor.reviewsCount} doctorId={doctor.id} />
        <DoctorCard.BookButton onClick={() => openSchedulePopup()} className='min-width-auto!' />
      </DoctorCard>
    </div>
  );
};

export default DoctorsListItem;
