import { getMyWeekAppointments } from '@/app/appointment/AppointmentThunks';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Icon } from '@/components/UI';
import type { TAppointment } from '@/dataTypes/Appointment';
import { useAppointmentPatientPopup } from '@/hooks/popups/useAppointmentPatientPopup';
import { cn } from '@/utils/cn';
import DayJS from 'dayjs';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';

const DoctorDashboardCalendar = () => {
  const dispatch = useAppDispatch();

  const currentDate = new Date();
  const dayOfWeek = currentDate.getDay() === 0 ? 7 : currentDate.getDay();
  const [mondayDate, setMondayDate] = useState(addDays(currentDate, -(dayOfWeek - 1)));
  const calendarAndYearMonth = DayJS.utc(addDays(mondayDate, 2)).format('MMMM YYYY');
  const weekDates = getWeekDates(mondayDate);

  const weekAppointments = useAppSelector(state => state.appointment.weekAppointments);
  const doctorSchedules = useAppSelector(state => state.appointment.doctorSchedules);

  if (!doctorSchedules) return null;

  useEffect(() => {
    const sundayDate = weekDates[weekDates.length - 1];
    const startDate = new Date(mondayDate.getFullYear(), mondayDate.getMonth(), mondayDate.getDate() + 1);
    startDate.setUTCHours(0, 0, 0, 0); // set time to 00:00:00 UTC

    const endDate = new Date(sundayDate.getFullYear(), sundayDate.getMonth(), sundayDate.getDate() + 1);
    endDate.setUTCHours(23, 59, 59, 0); // set time to 23:59:59.999 UTC

    dispatch(
      getMyWeekAppointments({
        startDate,
        endDate,
      }),
    );
  }, [dispatch, mondayDate]);

  function addDays(date: Date, numDays: number) {
    return new Date(date.getTime() + numDays * 24 * 60 * 60 * 1000);
  }

  function getWeekDates(mondayDate: Date) {
    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(new Date(mondayDate.getTime() + i * 24 * 60 * 60 * 1000));
    }
    return weekDates;
  }

  const times = Array.from(
    { length: doctorSchedules.ends_work_hour_utc - doctorSchedules.starts_work_hour_utc + 1 },
    (_, i) => {
      const hour = doctorSchedules.starts_work_hour_utc + i;
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      return hour < 12 ? `${formattedHour}:00 AM` : `${formattedHour}:00 PM`;
    },
  );

  const handleOnClickShevron = (isLeft: boolean) => {
    setMondayDate(prevMondayDate => {
      if (isLeft) return new Date(addDays(prevMondayDate, -7));
      return new Date(addDays(prevMondayDate, 7));
    });
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center gap-4'>
        <span className='text-lg font-medium text-black'>{calendarAndYearMonth}</span>

        <div className='flex items-center gap-2'>
          <ShevronButton
            isLeft={true}
            onClick={() => {
              handleOnClickShevron(true);
            }}
          />
          <ShevronButton
            onClick={() => {
              handleOnClickShevron(false);
            }}
          />
        </div>
      </div>

      <div className='grid gap-2'>
        <WeekRowComponent weekDates={weekDates} />
        <div className='relative grid gap-2'>
          {times.map(time => (
            <HourRowComponent
              key={time}
              time={time}
              weekDates={weekDates}
              hourAppointments={weekAppointments!.filter(a => {
                console.log(DayJS(a.startedAt).utc().format('h:mm A'));
                return DayJS(a.startedAt).utc().format('h:mm A') === time;
              })}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ShevronButton = ({ isLeft = false, onClick = () => {} }) => {
  return (
    <button type='button' onClick={onClick} className='flex size-6 items-center justify-center'>
      <Icon variant='shevron-right' className={cn(isLeft ? 'rotate-180' : '')} />
    </button>
  );
};

const GridRowCalendar = ({ children }: { children: ReactNode }) => {
  return <div className='grid flex-1 grid-cols-7 gap-2'>{children}</div>;
};

const WeekRowComponent = ({ weekDates }: { weekDates: Date[] }) => {
  return (
    <div className='flex gap-2'>
      <div className='w-14 shrink-0 max-sm:w-6'></div>
      <GridRowCalendar>
        {weekDates.map((day, index) => {
          return (
            <div key={index} className='flex flex-col items-center gap-[2px] font-medium'>
              <span className='text-grey-1 max-lg:text-xs'>{DayJS.utc(day).format('ddd').toLocaleUpperCase()}</span>
              <span className='text-sm text-grey-2 max-lg:text-xs'>
                {DayJS.utc(day).format('MMM DD').toLocaleUpperCase()}
              </span>
            </div>
          );
        })}
      </GridRowCalendar>
    </div>
  );
};

const HourRowComponent = ({
  time,
  weekDates,
  hourAppointments,
}: {
  time: string;
  weekDates: Date[];
  hourAppointments: TAppointment[];
}) => {
  const isCurrentTime = DayJS().format('h:00 A') === time;
  const currentMinute = DayJS().minute();
  const percentageHeight = `${(currentMinute / 60) * 100}%`;

  const { openPopup } = useAppointmentPatientPopup();

  return (
    <div className='relative flex gap-2'>
      <div className='flex w-14 shrink-0 flex-col justify-center text-xs font-medium text-black-2 max-sm:w-6 '>
        {time}
      </div>
      {isCurrentTime && (
        <CurrentTimeLine title={DayJS().format('h:mm A')} className='absolute z-10' style={{ top: percentageHeight }} />
      )}
      <GridRowCalendar>
        {weekDates.map((day, index) => {
          const isCurrentDate = DayJS().format('MMM DD') === DayJS(day).format('MMM DD');
          const appointment = hourAppointments.find(
            a => DayJS(a.startedAt).format('MMM DD') === DayJS(day).format('MMM DD'),
          );
          let appointmentType = appointment?.type || '';
          appointmentType =
            appointmentType.charAt(0).toLocaleUpperCase() +
            appointmentType.slice(1).toLocaleLowerCase().replace('_', ' ');

          return (
            <div
              key={index}
              className={cn(
                'flex h-16 flex-col items-center justify-end rounded-xl bg-white p-1',
                isCurrentDate ? 'bg-main-light' : '',
              )}
            >
              {!!appointment && (
                <div
                  className={cn(
                    'w-full cursor-pointer truncate rounded-2xl bg-main-light px-2 py-[3px] font-medium capitalize max-xl:text-xs',
                    isCurrentDate ? 'bg-white opacity-50' : '',
                  )}
                  onClick={() => {
                    openPopup(appointment);
                  }}
                >
                  {appointmentType}
                </div>
              )}
            </div>
          );
        })}
      </GridRowCalendar>
    </div>
  );
};

const CurrentTimeLine = ({
  className = '',
  title = '',
  style,
}: {
  className: string;
  title: string;
  style: CSSProperties;
}) => {
  return (
    <div style={style} className={cn('relative h-[2px] w-full bg-main', className)} title={title}>
      <span className='absolute left-0 top-1/2 block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-main'></span>
    </div>
  );
};

export default DoctorDashboardCalendar;
