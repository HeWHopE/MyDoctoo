import { ImgAvatarKey, StarsRating } from '@UI/index';

type ScheduleHeader = {
  fullName: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  specialization: string;
  payrate: number;
  doctorId: string;
};

export default function ScheduleHeader({
  fullName,
  avatar,
  rating,
  reviewsCount,
  specialization,
  payrate,
  doctorId,
}: ScheduleHeader) {
  return (
    <div className='flex items-center gap-x-6'>
      <ImgAvatarKey avatarKey={avatar} className='max-h-28 max-w-28 shrink-0 rounded-lg' />

      <div className='flex flex-1 flex-col gap-y-2'>
        <div className='flex justify-between'>
          <span className='text-2xl font-bold text-black'>{fullName}</span>
          <div>
            <span className='text-2xl font-bold text-main'>${payrate}</span>
            <span className='text-base font-medium text-grey-1'> / visit</span>
          </div>
        </div>

        <div className='flex flex-col gap-y-2'>
          <span className='text-base font-medium text-grey-1'>{specialization}</span>

          <StarsRating doctorRating={rating} doctorReviewsCount={reviewsCount} doctorId={doctorId} />
        </div>
      </div>
    </div>
  );
}
