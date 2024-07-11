import type { Dayjs } from 'dayjs';
import Icon from '../../Icon/Icon';
import { cn } from '@/utils/cn';

type WeekPickerProps = {
  dates: Dayjs[];
  weeks: string[];
  currentDate: Dayjs;
  decrementDate: () => void;
  incrementDate: () => void;
};

export default function WeekPicker({ dates, weeks, currentDate, decrementDate, incrementDate }: WeekPickerProps) {
  return (
    <div className='flex items-center gap-x-6'>
      <Icon variant='shevron-right' className=' h-6 w-6 rotate-180 cursor-pointer text-text' onClick={decrementDate} />

      <div className='flex w-full gap-x-6'>
        {dates.map((date, index) => (
          <div
            key={index}
            className={cn(
              'flex flex-1 select-none flex-col items-center justify-center rounded-lg px-6 py-2',
              date.isSame(currentDate, 'day')
                ? 'bg-main-light text-base font-semibold text-black'
                : 'bg-white text-black',
            )}
          >
            <div>{weeks[(date.day() + 6) % 7]}</div>
            <div>{date.format('MMM D')}</div>
          </div>
        ))}
      </div>

      <Icon variant='shevron-right' className='h-6 w-6 cursor-pointer text-text' onClick={incrementDate} />
    </div>
  );
}
