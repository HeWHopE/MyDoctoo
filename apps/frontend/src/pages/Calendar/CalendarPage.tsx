import dayjs from 'dayjs';
import { useEffect, useState, useMemo } from 'react';
import PageHeader from '../PageHeader';
import BigCalendar from './Components/BigCalendar/BigCalendar';
import AppointmentsWidget from './Components/AppointmentsWidget/AppointmentsWidget';
import { Button, Icon } from '@/components/UI';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getMyAppointments } from '@/app/appointment/AppointmentThunks';
import type { IAppointment } from '@/dataTypes/Appointment';
import { useNavigate } from 'react-router';

export default function CalendarPage() {
  const today = new Date();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [appointmentsForDay, setAppointmentsForDay] = useState<IAppointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const appointments = useAppSelector(state => state.appointment.appointments);

  const allPlannedAppointments = useMemo(
    () => appointments.filter(appointment => appointment.status === 'PLANNED'),
    [appointments],
  );

  useEffect(() => {
    dispatch(getMyAppointments());
  }, [dispatch]);

  useEffect(() => {
    const filteredAppointments = allPlannedAppointments.filter(appointment =>
      dayjs(appointment.startedAt).isSame(selectedDate, 'day'),
    );

    setAppointmentsForDay(filteredAppointments);
  }, [selectedDate, allPlannedAppointments]);

  function handleDateChange(newDate: Date) {
    setSelectedDate(newDate);
  }

  function exportSchedule() {
    console.log('Export');
  }

  function findDoctor() {
    navigate('/doctors');
  }

  return (
    <div className='grid gap-6'>
      <PageHeader iconVariant='date' title='Calendar' className='!mb-0 flex flex-col gap-6 sm:flex-row sm:gap-2'>
        <div className='flex w-full flex-col-reverse gap-2 sm:flex-row'>
          <Button
            className='flex cursor-not-allowed items-center justify-center bg-white'
            onClick={exportSchedule}
            type='secondary'
            disabled
          >
            <Icon variant='download' className='mr-2 items-center justify-center' />
            Export
          </Button>

          <Button onClick={findDoctor} type='primary'>
            Find a doctor
          </Button>
        </div>
      </PageHeader>

      <section className='flex w-full flex-col-reverse gap-6 sm:flex-col md:justify-between md:gap-8 xl:grid xl:grid-cols-[1fr_auto] 2xl:gap-24'>
        <AppointmentsWidget appointmentsForDay={appointmentsForDay} selectedDate={selectedDate} />
        <BigCalendar meetingsForDay={allPlannedAppointments} chooseDate={handleDateChange} />
      </section>
    </div>
  );
}
