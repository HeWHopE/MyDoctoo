import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import utc from 'dayjs/plugin/utc';
import BookAppointmentBtn from './ScheduleBookComponents/BookAppointmentBtn';
import TimePicker from './ScheduleBookComponents/TimePicker';
import WeekPicker from './ScheduleBookComponents/WeekPicker';
import { AppointmentStatus } from '@/dataTypes/Appointment';
import type { ICreateAppointment } from '@/dataTypes/Appointment';
import { createAppointment, rescheduleAppointment } from '@/app/appointment/AppointmentThunks';
import type { Dispatch, SetStateAction } from 'react';
dayjs.extend(utc);

const weeks = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type ScheduleBookProps = {
  doctorId: string;
  patientId: string;
  closePopup: () => void;
  currentDay?: Dayjs;
  rescheduling?: boolean;
  appointmentId?: string;
  openSuccessulModal: () => void;
  setAppointmentSelectedDate: Dispatch<SetStateAction<Dayjs | undefined>>;
};

export default function ScheduleBook({
  closePopup,
  currentDay = dayjs(),
  doctorId,
  patientId,
  rescheduling,
  appointmentId,
  openSuccessulModal,
  setAppointmentSelectedDate,
}: ScheduleBookProps) {
  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [currentDate, setCurrentDate] = useState(currentDay);
  const [newAppointment, setNewAppointment] = useState<ICreateAppointment>({
    doctorId: '',
    patientId: '',
    createdAt: '',
    status: AppointmentStatus.PLANNED,
    endedAt: '',
    startedAt: '',
  });

  const appointments = useAppSelector(state => state.appointment.appointments);

  const plannedAppointments = useMemo(() => {
    return appointments
      .filter(appointment => appointment.status === 'Planned')
      .map(appointment => dayjs.utc(dayjs(appointment.startedAt).format('YYYY-MM-DD hh:mm a')));
  }, [appointments]);

  const isAppointmentPlanned = (date: Dayjs, time: string) => {
    const [hour, minutePart] = time.split(':');
    const minute = minutePart.slice(0, 2);
    const ampm = minutePart.slice(3);
    const hour24 = ampm === 'pm' && hour !== '12' ? Number(hour) + 12 : hour;
    const dateTime = dayjs.utc(`${date.format('YYYY-MM-DD')} ${hour24}:${minute}`, 'YYYY-MM-DD HH:mm');
    return plannedAppointments.some(appointment => dateTime.isSame(appointment, 'minute'));
  };

  const incrementDate = () => setCurrentDate(currentDate.add(3, 'day'));
  const decrementDate = () => setCurrentDate(currentDate.subtract(3, 'day'));

  const dates = [currentDate, currentDate.add(1, 'day'), currentDate.add(2, 'day')];
  const schedule = [
    { week: 'Mon', timeSlots: ['10:00 am', '11:00 am', '12:00 pm', '01:00 pm'] },
    { week: 'Tue', timeSlots: ['10:00 am', '11:00 am', '12:00 pm', '01:00 pm', '02:00 pm'] },
    {
      week: 'Wed',
      timeSlots: ['10:00 am', '11:00 am', '12:00 pm', '01:00 pm', '02:00 pm', '03:00 pm'],
    },
    { week: 'Thu', timeSlots: ['10:00 am', '01:00 pm', '02:00 pm', '03:00 pm', '04:00 pm'] },
    {
      week: 'Fri',
      timeSlots: ['10:00 am', '11:00 am', '12:00 pm', '01:00 pm', '02:00 pm', '03:00 pm', '04:00 pm'],
    },
    {
      week: 'Sat',
      timeSlots: ['10:00 am', '11:00 am', '01:00 pm', '02:00 pm', '03:00 pm', '04:00 pm'],
    },
    {
      week: 'Sun',
      timeSlots: ['01:00 pm', '02:00 pm', '03:00 pm', '04:00 pm'],
    },
  ];

  const getFirstAvailableTime = () => {
    for (const date of dates) {
      const dayOfWeek = weeks[date.day()];
      const daySchedule = schedule.find(item => item.week === dayOfWeek);
      if (daySchedule) {
        for (const time of daySchedule.timeSlots) {
          const dateTime = dayjs(`${date.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD hh:mm a');
          if (!isAppointmentPlanned(date, time)) {
            return dateTime;
          }
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const firstAvailableTime = getFirstAvailableTime();
    if (firstAvailableTime) {
      setSelectedDate(firstAvailableTime);
    }
  }, [currentDate]);

  useEffect(() => {
    if (!rescheduling) {
      if (!selectedDate) return;
      const createNewAppointment: ICreateAppointment = {
        doctorId: doctorId,
        patientId: patientId,
        createdAt: dayjs().toISOString(),
        status: AppointmentStatus.PENDING_PAYMENT,
        startedAt: selectedDate.format('YYYY-MM-DDTHH:mm:ss[Z]'),
        endedAt: selectedDate.add(1, 'hour').format('YYYY-MM-DDTHH:mm:ss[Z]'),
      };

      setNewAppointment(createNewAppointment);
    }
  }, [selectedDate]);

  function handleBookAppointment() {
    if (!selectedDate) return;

    if (rescheduling && appointmentId) {
      dispatch(rescheduleAppointment({ id: appointmentId, newDate: selectedDate.format('YYYY-MM-DDTHH:mm:ss[Z]') }));
    } else {
      dispatch(createAppointment(newAppointment));
    }

    closePopup();
    setAppointmentSelectedDate(selectedDate!);
    openSuccessulModal();
  }

  function selectDate(date: Dayjs, time: string, isPlanned: boolean) {
    if (isPlanned) return;
    setSelectedDate(dayjs(`${date.format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD hh:mm a'));
  }

  return (
    <>
      <div className='flex flex-grow flex-col gap-y-8'>
        <WeekPicker
          dates={dates}
          weeks={weeks}
          currentDate={currentDate}
          decrementDate={decrementDate}
          incrementDate={incrementDate}
        />

        <TimePicker
          dates={dates}
          weeks={weeks}
          schedule={schedule}
          selectedDate={selectedDate}
          isAppointmentPlanned={isAppointmentPlanned}
          selectDate={selectDate}
        />

        <BookAppointmentBtn
          selectDate={selectedDate}
          handleBookAppointment={handleBookAppointment}
          rescheduling={rescheduling}
        />
      </div>
    </>
  );
}
