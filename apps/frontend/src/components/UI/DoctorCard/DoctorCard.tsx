import dayjs from 'dayjs';
import type React from 'react';
import { Link } from 'react-router-dom';
import { addDoctorToFavorites, removeDoctorFromFavorites } from '@/app/doctor/DoctorThunks';
import { useAppDispatch } from '@/app/hooks';
import type { Specialization } from '@/dataTypes/Doctor';
import { Button, Icon, ImgAvatarKey, Tag } from '@UI/index';
import { cn } from '@/utils/cn';

const DoctorCard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={cn(
        'grid w-full auto-rows-auto grid-cols-[max-content_1fr] gap-1 rounded-xl bg-white p-6 sm:grid-cols-[max-content_1fr_max-content]',
        className,
      )}
    >
      {children}
    </div>
  );
};

DoctorCard.Image = Image;
DoctorCard.ImageWithFavorite = ImageWithFavorite;
DoctorCard.Name = Name;
DoctorCard.Specializations = Specializations;
DoctorCard.Tags = Tags;
DoctorCard.Rating = Rating;
DoctorCard.BookButton = BookButton;
DoctorCard.TimeSlots = TimeSlots;
DoctorCard.PayrateLabel = PayrateLabel;

type ImageProps = {
  url: string;
  className?: string;
  alt?: string;
};

function Image({ url, className, alt }: ImageProps) {
  return (
    <ImgAvatarKey
      avatarKey={url}
      className={cn('col-span-1 row-span-4 aspect-square h-[112px] rounded-lg object-cover', className)}
      alt={alt || "Doctor's image"}
    />
  );
}

type ImageWithFavoriteProps = {
  doctorId: string;
  url: string;
  isFavorite: boolean;
  alt?: string;
};

function ImageWithFavorite({ doctorId, url, isFavorite, alt }: ImageWithFavoriteProps) {
  const dispatch = useAppDispatch();
  return (
    <div className='group relative col-span-1 row-span-4 aspect-square h-[112px]'>
      <ImgAvatarKey
        avatarKey={url}
        className='col-span-1 row-span-4 aspect-square h-[112px] rounded-lg object-cover'
        alt={alt || "Doctor's image"}
      />
      <div className='absolute left-0 top-0 flex h-full w-full items-end justify-end rounded-lg bg-semi-transparent opacity-0 transition duration-300 group-hover:opacity-100'>
        <button
          className='mb-1 mr-1 rounded-lg bg-white hover:bg-grey-5'
          onClick={() =>
            isFavorite ? dispatch(removeDoctorFromFavorites(doctorId)) : dispatch(addDoctorToFavorites(doctorId))
          }
        >
          <Icon variant={isFavorite ? 'favorite-filled' : 'favorite-empty'} />
        </button>
      </div>
    </div>
  );
}

type NameProps = { children: React.ReactNode; className?: string };

function Name({ children, className }: NameProps) {
  return (
    <h1 className={cn('col-start-2 row-span-1 px-2 text-lg font-semibold md:col-span-1', className)}>{children}</h1>
  );
}

type SpecializationsProps = { specializations: Specialization[]; className?: string };

function Specializations({ specializations, className }: SpecializationsProps) {
  return (
    <h2
      className={cn(
        'col-span-1 col-start-2 row-span-1 row-start-2 truncate whitespace-break-spaces pl-2 text-base font-medium text-grey-1 sm:col-span-2 sm:col-start-2 md:col-span-1 md:col-start-2',
        className,
      )}
    >
      {specializations.map(spec => spec.name).join(', ')}
    </h2>
  );
}

type TagsProps = { tags: string[]; tagClassName?: string; wrapperClassName?: string };

function Tags({ tags, tagClassName, wrapperClassName }: TagsProps) {
  return (
    <>
      {tags.length ? (
        <div
          className={cn(
            'col-span-full col-start-2 row-span-1 my-1 flex flex-wrap gap-1 sm:col-span-2 sm:col-start-2 sm:px-2 md:col-span-1 md:col-start-2',
            wrapperClassName,
          )}
        >
          {tags.map((tag, i) => (
            <Tag key={i} text={tag} icon={false} className={cn('h-fit min-w-fit', tagClassName)} />
          ))}
        </div>
      ) : null}
    </>
  );
}

type RatingProps = { rating: number; reviewsCount: number; starClassName?: string; doctorId: string };

function Rating({ rating, reviewsCount, starClassName, doctorId }: RatingProps) {
  const getRatingStars = () => {
    const stars = [];
    for (let i = 0; i <= 4; i++) {
      if (rating < i + 0.5) stars.push(<Icon variant='star' className={cn('text-grey-3', starClassName)} />);
      else if (rating > i + 0.5) stars.push(<Icon variant='star' className={cn('text-main', starClassName)} />);
      else stars.push(<Icon variant='star-half' className={cn('text-main', starClassName)} />);
    }
    return stars;
  };
  return (
    <div className='col-span-full col-start-2 row-span-1 flex items-center space-x-2 whitespace-pre-line px-2 text-main-medium sm:col-span-1 sm:col-start-2 sm:row-start-4'>
      <span className='flex'>{getRatingStars()}</span>

      <Link
        className='ml-2 text-black underline sm:whitespace-nowrap'
        to={`/reviews/?doctorId=${doctorId}`}
        target='_blank'
      >
        {reviewsCount} reviews
      </Link>
    </div>
  );
}

type BookButtonProps = { onClick: () => void; disabled?: boolean; className?: string };

function BookButton({ className, disabled, onClick }: BookButtonProps) {
  return (
    <Button
      type='primary'
      className={cn(
        'col-span-full row-span-1 mt-1 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:mt-0 lg:w-28 lg:justify-self-end',
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      Book
    </Button>
  );
}

type TimeSlotsProps = {
  timestamps: string[] | Date[];
  onClickSlot: (index: number) => void;
  onClickMore: () => void;
  wrapperClassName?: string;
  slotButtonClassName?: string;
};

function TimeSlots({ timestamps, onClickSlot, onClickMore, wrapperClassName, slotButtonClassName }: TimeSlotsProps) {
  if (!timestamps?.length) return null;
  let countToShow = 0;
  if (timestamps.length <= 3) countToShow = timestamps.length;
  else if (timestamps.length === 4) countToShow = timestamps.length;
  else countToShow = 3;
  const timestampToHoursMinutes = (timestamp: string | Date) => {
    return dayjs(timestamp).format('hh:mm a');
  };
  return (
    <div
      className={cn(
        'col-span-full col-start-1 mt-1 md:row-auto lg:col-start-3 lg:row-span-3 lg:row-start-2 lg:mt-0',
        wrapperClassName,
      )}
    >
      <div
        className={`grid ${timestamps.length > 2 ? 'grid-rows-2' : 'grid-rows-1 md:grid-cols-1'} ${timestamps.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-2 whitespace-nowrap`}
      >
        {timestamps.length
          ? timestamps.slice(0, countToShow).map((timestamp, i) => (
              <Button
                key={i}
                type='secondary'
                className={cn(
                  `min-w-fit px-0 sm:min-w-16 lg:w-28 ${i === 2 && timestamps.length === 3 ? 'lg:col-start-2' : ''}`,
                  slotButtonClassName,
                )}
                onClick={() => onClickSlot(i)}
                disabled={false}
              >
                {timestampToHoursMinutes(timestamp)}
              </Button>
            ))
          : null}

        {timestamps.length > 4 ? (
          <Button
            type='secondary'
            className={cn('min-w-fit px-0 sm:min-w-16 lg:w-28', slotButtonClassName)}
            onClick={onClickMore}
            disabled={false}
          >
            More times
          </Button>
        ) : null}
      </div>
    </div>
  );
}

type PayrateLabelProps = { payrate: number; numberClassName?: string; className?: string };

function PayrateLabel({ payrate, numberClassName, className }: PayrateLabelProps) {
  return (
    <p
      className={cn(
        'col-start-2 row-span-1 row-start-3 px-2 sm:col-start-3 sm:row-start-1 md:row-start-1 md:text-right',
        className,
      )}
    >
      <span className={cn('text-lg', numberClassName)}>${payrate}</span>
      <span className='text-sm text-grey-1'> / visit</span>
    </p>
  );
}

export default DoctorCard;
