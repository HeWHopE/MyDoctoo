import { useState } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import weekdayPlugin from 'dayjs/plugin/weekday';
import BigCalendarBody from './BigCalendarBody';
import BigCalendarHeader from './BigCalendarHeader';
import type { IAppointment } from '@/dataTypes/Appointment';

type BigCalendar = {
  chooseDate: (newDate: Date) => void;
  meetingsForDay: IAppointment[];
};

export default function BigCalendar({ chooseDate, meetingsForDay }: BigCalendar) {
  dayjs.extend(weekdayPlugin);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());

  return (
    <section className='flex w-full max-w-[900px] flex-col gap-y-4'>
      <BigCalendarHeader currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />

      <BigCalendarBody currentMonth={currentMonth} meetingsForDay={meetingsForDay} handleDateChange={chooseDate} />
    </section>
  );
}
