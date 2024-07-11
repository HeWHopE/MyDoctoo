import { useAppSelector } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@UI/index';
import ShortInfoCard from '../ShortInfoCard/ShortInfoCard';
import { useSchedulePopup } from '@/hooks/popups/useSchedulePopup';
import type { IDoctor } from '@/dataTypes/Doctor';

type AppointmentCardProps = {
  doctors: IDoctor[] | undefined;
};

export default function MyDoctorsCard({ doctors }: AppointmentCardProps) {
  const navigate = useNavigate();
  const patient = useAppSelector(state => state.patient.data);

  const { openPopup } = useSchedulePopup();

  function openSchedule(doctor: IDoctor) {
    openPopup({
      scheduleInfo: {
        patientId: patient.id,
        doctorId: doctor!.id,
        doctor: doctor!,
        reviews: [],
      },
    });
  }

  function handleSelectDoctor(doctor: IDoctor) {
    openSchedule(doctor);
  }

  return (
    <>
      <aside
        className={`flex h-full min-h-[236px] w-full flex-col gap-6 rounded-xl bg-white  p-2 sm:p-6 lg:max-w-[302px]`}
      >
        <div
          className={`flex flex-row items-center ${doctors && doctors?.length > 0 ? 'justify-between' : 'justify-center'}`}
        >
          <h3 className='text-lg font-medium leading-6'>My doctors</h3>
          {doctors && doctors?.length > 0 && (
            <button
              className='flex h-fit w-fit items-center justify-center gap-1 rounded-2xl border-none bg-background px-1 py-1 text-text sm:px-4'
              onClick={() => navigate(`/my-doctors`)}
            >
              <p>{`View all (${doctors?.length})`}</p>
              <Icon variant={'arrow-right'} />
            </button>
          )}
        </div>
        {doctors && doctors?.length > 0 ? (
          <div className='flex flex-col'>
            {doctors?.slice(0, 2).map((doctor: IDoctor, key: number) => (
              <ShortInfoCard
                onClick={() => {
                  handleSelectDoctor(doctor);
                }}
                fullName={`Dr. ${doctor.firstName + ' ' + doctor.lastName}`}
                about={doctor.specializations.map(specialization => specialization.name).join(', ')}
                avatarKey={doctor.avatarKey}
                classNames='bg-background w-full rounded-xl mb-[14px] cursor-pointer hover:bg-[#cadbe6]'
                key={key}
                id={doctor.id}
              />
            ))}
          </div>
        ) : (
          <p className='text-center font-normal leading-6 lg:px-4'>Your doctors will be displayed here</p>
        )}
      </aside>
    </>
  );
}
