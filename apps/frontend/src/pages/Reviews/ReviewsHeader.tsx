import { Button, Icon } from '@/components/UI';
import type { IDoctor } from '@/dataTypes/Doctor';

type ReviewsHeader = {
  doctor: IDoctor;
  openSchedule: () => void;
};

export default function ReviewsHeader({ doctor, openSchedule }: ReviewsHeader) {
  const { avatarKey, firstName, lastName, specializations } = doctor;
  const fullName = `Dr. ${firstName} ${lastName}`;

  return (
    <div className='flex w-3/5 items-center gap-x-6'>
      <img
        width={112}
        height={112}
        src={`${import.meta.env.VITE_S3_BASE_URL}/${avatarKey}`}
        alt={fullName}
        className='rounded-lg'
      />

      <div className='flex flex-1 flex-col gap-y-2'>
        <div className='flex justify-between'>
          <span className='text-2xl font-bold text-black'>{fullName}</span>
          <Button onClick={openSchedule} type='primary' btnType='button'>
            Book appointment
          </Button>
        </div>

        <div className='flex flex-col gap-y-2'>
          <span className='text-base font-medium text-grey-1'>{specializations[0].name}</span>

          <div className='flex items-center gap-x-3'>
            <div className='flex cursor-default gap-x-1'>
              {Array.from({ length: 5 }, (_, i) => (
                <Icon
                  key={'star-' + i}
                  variant='star'
                  className={`h-[18px] w-[18px] ${doctor.rating > i ? 'text-main-dark' : 'text-grey-5'}`}
                />
              ))}
            </div>

            <span className='cursor-default text-text'>
              Total reviews: <span className='font-bold text-black'>{doctor.reviewsCount}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
