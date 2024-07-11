import { Link } from 'react-router-dom';
import Icon from '../Icon/Icon';
import type { IReview } from '@/dataTypes/Review';

type ScheduleTestimonials = {
  reviews: IReview[];
  doctorId: string;
};

export default function ScheduleTestimonials({ reviews, doctorId }: ScheduleTestimonials) {
  return (
    <div className='flex w-full flex-col gap-y-4'>
      <span className='text-lg font-semibold leading-6 text-black'>Testimonials</span>

      {reviews.map(({ text, patient, rate }: IReview, id) => {
        if (!patient) return null;
        const patientName = `${patient.user.firstName} ${patient.user.lastName}`;

        return (
          <div className='flex flex-col gap-y-3 rounded-xl bg-background p-4' key={`review-${id}`}>
            <div className='flex cursor-pointer gap-x-1'>
              {Array.from({ length: 5 }, (_, i) => (
                <Icon
                  key={'star-' + i}
                  variant='star'
                  className={`h-[18px] w-[18px] ${rate > i ? 'text-main-dark' : 'text-grey-5'}`}
                />
              ))}
            </div>

            {text}

            {patientName}
          </div>
        );
      })}

      <Link to={`/reviews?doctorId=${doctorId}`} target='_blank' className='text-base font-medium text-main underline'>
        See more
      </Link>
    </div>
  );
}
