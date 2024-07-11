import { Badge, Icon, ImgAvatarKey, StarsRating } from '@UI/index';
import type { IDoctor } from '@/dataTypes/Doctor';
import useWindowWide from '@/hooks/useWindowWide';

type PopupBodyProps = {
  openReschedule: () => void;
  doctorId: string;
  status: string;
  doctor: IDoctor;
};

export default function PopupBody({ openReschedule, doctorId, status, doctor }: PopupBodyProps) {
  const { firstName, lastName, avatarKey, rating, reviewsCount, specializations } = doctor;
  const tabletWidth = useWindowWide(824);
  const mobileWidth = useWindowWide(692);

  const fullName = `Dr. ${firstName} ${lastName}`;
  const firstSpecializationName = specializations.length > 0 ? specializations[0].name : 'Doctor';

  function AppointmentWith() {
    return (
      <div className={`flex h-6 flex-row justify-between ${mobileWidth ? 'text-lg' : 'text-sm'}`}>
        <span className={`font-medium text-black`}>
          Appointment with <span className='font-semibold text-main'>{fullName}</span>
        </span>
        {tabletWidth && (status === 'PLANNED' || status === 'PENDING_PAYMENT') && (
          <div className='flex cursor-pointer items-end justify-center gap-x-1' onClick={openReschedule}>
            <Icon variant='edit' className='h-[18px] w-[18px] text-grey-1' />
            <span className={`text-sm font-medium text-grey-1`}>Reschedule</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {!mobileWidth && <AppointmentWith />}

      <div className='flex h-32 justify-start gap-x-6'>
        <ImgAvatarKey avatarKey={avatarKey} className='max-h-28 max-w-28 shrink-0 rounded-lg' />

        <div className='flex w-full flex-col'>
          {mobileWidth && <AppointmentWith />}
          <div className='flex flex-col gap-y-2'>
            {!tabletWidth && (status === 'PLANNED' || status === 'PENDING_PAYMENT') && (
              <div className='flex cursor-pointer items-end justify-start gap-x-1' onClick={openReschedule}>
                <Icon
                  variant='edit'
                  className={`${mobileWidth ? 'h-[18px] w-[18px]' : 'h-[16px] w-[16px]'} text-grey-1`}
                />
                <span className={`${mobileWidth ? 'text-sm' : 'text-xs'} font-medium text-grey-1`}>Reschedule</span>
              </div>
            )}

            <span className={`${mobileWidth ? 'text-base' : 'text-sm'} font-medium text-grey-1`}>
              {firstSpecializationName}
            </span>
          </div>

          <Badge badgeColor='bg-main-light' labelColor='text-main'>
            Top doctor
          </Badge>

          <div className={`${tabletWidth ? '' : 'ml-[-138px]'} ${mobileWidth ? '' : 'mt-8'}`}>
            <StarsRating doctorId={doctorId} doctorRating={rating} doctorReviewsCount={reviewsCount} />
          </div>
        </div>
      </div>
    </>
  );
}
