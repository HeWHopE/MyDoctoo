import Icon from '../Icon/Icon';
import { Link } from 'react-router-dom';

type StarsRatingProps = {
  doctorId: string;
  doctorRating: number;
  doctorReviewsCount: number;
};

export default function StarsRating({ doctorId, doctorRating, doctorReviewsCount }: StarsRatingProps) {
  return (
    <>
      <div className='flex items-center gap-x-3'>
        <div className='flex cursor-pointer gap-x-1'>
          {Array.from({ length: 5 }, (_, i) => (
            <Icon
              key={'star-' + i}
              variant='star'
              className={`h-[18px] w-[18px] ${doctorRating > i ? 'text-main-dark' : 'text-grey-5'}`}
            />
          ))}
        </div>

        <Link to={`/reviews?doctorId=${doctorId}`} target='_blank' className=' text-black underline'>
          {doctorReviewsCount} reviews
        </Link>
      </div>
    </>
  );
}
