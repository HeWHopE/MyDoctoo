import { Icon } from '@/components/UI';
import type { IReview } from '@/dataTypes/Review';

type ReviewsBodyProps = { reviews: IReview[] };

export default function ReviewsBody({ reviews }: ReviewsBodyProps) {
  return (
    <div className='flex w-3/4 flex-col gap-y-5'>
      {reviews.map((review, index) => {
        return (
          <div key={index} className='flex flex-col gap-y-4 rounded-xl bg-white p-4'>
            <div className='flex items-center gap-x-3'>
              <div className='flex cursor-pointer gap-x-1'>
                {Array.from({ length: 5 }, (_, i) => (
                  <Icon
                    key={'star-' + i}
                    variant='star'
                    className={`h-[18px] w-[18px] ${review.rate > i ? 'text-main-dark' : 'text-grey-4'}`}
                  />
                ))}
              </div>
            </div>

            <blockquote className='border-l-4 border-grey-1 border-opacity-50 px-2'>
              <p className='text-gray-900 text-base font-medium italic leading-relaxed'>{review.text}</p>
            </blockquote>

            <span className='font-semibold italic'>{`${review.patient?.user.firstName} ${review.patient?.user.lastName}`}</span>
          </div>
        );
      })}
    </div>
  );
}
