import { cn } from '@/utils/cn';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';

type TimePickerProps = {
  dates: Dayjs[];
  weeks: string[];
  schedule: {
    week: string;
    timeSlots: string[];
  }[];
  selectedDate: Dayjs | null;
  isAppointmentPlanned: (date: Dayjs, time: string) => boolean;
  selectDate: (date: Dayjs, time: string, isPlanned: boolean) => void;
};

export default function TimePicker({
  dates,
  weeks,
  schedule,
  selectedDate,
  isAppointmentPlanned,
  selectDate,
}: TimePickerProps) {
  return (
    <div className='grid max-h-80 w-full grid-cols-3 gap-x-6 self-center overflow-hidden px-12'>
      {dates.map((date, index) => {
        const dayOfWeek = weeks[date.day()];
        const daySchedule = schedule.find(item => item.week === dayOfWeek);

        return (
          <div key={index} className=''>
            {daySchedule?.timeSlots.map((time, i) => {
              const isPlanned = isAppointmentPlanned(date, time);

              return (
                <button
                  key={i}
                  className={cn(
                    'mb-4 flex h-10 w-full items-center justify-center rounded-lg text-base font-normal text-black',
                    selectedDate?.isSame(dayjs(`${date.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD hh:mm a'), 'minute')
                      ? 'bg-main text-white'
                      : 'bg-main-light hover:bg-main-medium',
                    isPlanned
                      ? 'cursor-not-allowed border border-grey-4 bg-transparent text-grey-4 hover:bg-transparent'
                      : '',
                  )}
                  onClick={() => selectDate(date, time, isPlanned)}
                  disabled={isPlanned}
                >
                  {time}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
