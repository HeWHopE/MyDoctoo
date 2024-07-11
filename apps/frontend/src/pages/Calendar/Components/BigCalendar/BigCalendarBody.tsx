import { useState } from 'react';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import type { IAppointment } from '@/dataTypes/Appointment';
import useWindowWide from '@/hooks/useWindowWide';
import { getMonthDays } from '@/utils/getMonthDays';
import { daysOfWeek } from '@/constants/daysOfWeek';

interface BigCalendarBodyProps {
  meetingsForDay: IAppointment[];
  currentMonth: Dayjs;
  handleDateChange: (newDate: Date) => void;
}

export default function BigCalendarBody({ meetingsForDay, currentMonth, handleDateChange }: BigCalendarBodyProps) {
  const mobileWidth = useWindowWide(768);
  const days = getMonthDays(currentMonth as Dayjs);
  const today = dayjs();
  const [selectedDate, setSelectedDate] = useState<Dayjs>(today);

  function chooseAppointments(date: Dayjs) {
    setSelectedDate(date);
    handleDateChange(date.toDate());
  }

  return (
    <>
      <div className='grid grid-cols-7'>
        {daysOfWeek.map(day => (
          <time
            key={day}
            className='mb-2 pr-4 text-right text-[10px] font-medium uppercase text-middle-grey md:text-base'
          >
            {day}
          </time>
        ))}
      </div>

      <div className='grid grid-cols-7 gap-1 rounded-xl pl-1 pr-1 sm:gap-[13px]'>
        {days.map((day, index) => {
          const meetings =
            meetingsForDay && meetingsForDay.filter(meeting => day.isSame(meeting.startedAt, 'day')).slice(0, 3);

          const isToday = day.isSame(today, 'day');
          const hasMeetings = meetings && meetings.length > 0;
          const doctorName =
            meetings && meetings.length > 0
              ? `Dr. ${meetings[0]?.doctor?.firstName || ''} ${meetings[0]?.doctor?.lastName || ''}`
              : '';
          return (
            <div
              onClick={() => chooseAppointments(day)}
              className={`flex aspect-[1] h-auto min-h-[35px]
              w-auto min-w-[35px] cursor-pointer select-none flex-col justify-between rounded-xl border border-transparent bg-white text-base font-normal hover:border hover:border-main md:p-1 lg:px-2.5 lg:pb-3 lg:pt-2.5 xl:h-[116px] xl:w-[116px] ${day.month() === currentMonth?.month() ? 'text-text' : 'text-grey-3'}  ${selectedDate && selectedDate.isSame(day, 'day') && 'ring-1 ring-main'}`}
              key={index}
            >
              <p
                className={`mr-1 mt-1 self-end text-xs sm:text-base sm:font-medium lg:mr-0 lg:mt-0 ${isToday && '!m-px h-[19px] w-[19px] rounded-full bg-main p-0.5 text-white sm:h-[26px] sm:w-[26px]'}`}
              >
                <time className={`flex h-full w-full items-start justify-center`}>{day.format('D')}</time>
              </p>

              {hasMeetings &&
                (!mobileWidth ? (
                  <p className='aspect-[1] max-h-[40%] max-w-[40%] rounded-full bg-main-light text-[3vw] text-black sm:max-h-6 sm:max-w-6 sm:text-base '>
                    <span className='flex h-full w-full items-center justify-center'>{meetings.length}</span>
                  </p>
                ) : (
                  <div
                    key={index}
                    className={`flex h-full max-h-7 w-full max-w-[92px] items-center self-center rounded-2xl bg-main-light px-2 py-1 
                    ${meetings.length >= 2 ? 'flex-row justify-between' : 'justify-center md:justify-start'}`}
                  >
                    <p className='overflow-hidden text-ellipsis whitespace-nowrap text-xs font-medium text-black xl:text-sm'>
                      {meetings && meetings.length > 1 ? 'Calls' : doctorName}
                    </p>
                    {meetings.length > 1 && (
                      <p className='flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-medium'>
                        {meetings.length}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    </>
  );
}
