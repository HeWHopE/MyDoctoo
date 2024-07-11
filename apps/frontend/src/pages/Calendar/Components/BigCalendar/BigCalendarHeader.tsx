import type { Dayjs } from 'dayjs';

type BigCalendarHeaderProps = {
  currentMonth: Dayjs;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Dayjs>>;
};

export default function BigCalendarHeader({ currentMonth, setCurrentMonth }: BigCalendarHeaderProps) {
  const nextMonth = () => {
    if (currentMonth) {
      setCurrentMonth(currentMonth.add(1, 'month'));
    }
  };

  const prevMonth = () => {
    if (currentMonth) {
      setCurrentMonth(currentMonth.subtract(1, 'month'));
    }
  };

  const currentDate = `${currentMonth?.format('MMMM')} ${currentMonth?.format('YYYY')}`;

  return (
    <div className='flex items-center justify-between gap-x-4 text-lg text-black sm:justify-start'>
      <h3 className='text-lg font-medium not-italic leading-6 text-black'>{currentDate}</h3>

      <div className='flex items-center gap-2'>
        <button onClick={prevMonth} className='h-6 w-6'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M14.7373 5.13947C15.0391 5.35902 15.0881 5.75948 14.8466 6.03392L9.59643 12L14.8466 17.9661C15.0881 18.2405 15.0391 18.641 14.7373 18.8605C14.4354 19.0801 13.9949 19.0356 13.7534 18.7611L8.15339 12.3975C7.94887 12.1651 7.94887 11.8349 8.15339 11.6025L13.7534 5.23885C13.9949 4.96441 14.4354 4.91992 14.7373 5.13947Z'
              fill='#202323'
            />
          </svg>
        </button>
        <button onClick={nextMonth} className='h-6 w-6'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M10.2627 5.13947C9.96086 5.35902 9.91191 5.75948 10.1534 6.03392L15.4036 12L10.1534 17.9661C9.91191 18.2405 9.96086 18.641 10.2627 18.8605C10.5646 19.0801 11.0051 19.0356 11.2466 18.7611L16.8466 12.3975C17.0511 12.1651 17.0511 11.8349 16.8466 11.6025L11.2466 5.23885C11.0051 4.96441 10.5646 4.91992 10.2627 5.13947Z'
              fill='#202323'
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
