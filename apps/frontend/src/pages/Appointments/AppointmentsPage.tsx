import { Button } from '@/components/UI/Button/Button';
import PageHeader from '../PageHeader';
import InputSearch from '@/components/UI/Input/InputSearch';
import { useState, useReducer, useEffect } from 'react';
import AppointmentsList from './Components/AppointmentsList/AppointmentsList';
import { Calendar } from '@/components/UI/Calendar/Calendar';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import dayjs from 'dayjs';
import AppointmentsFilters from './Components/AppointmentsFilters/AppointmentsFilters';
import { getMyAppointments } from '@/app/appointment/AppointmentThunks';
import NoAppointments from './NoAppointments';
import { filterReducer, initialFilterState } from './filterReducer';
import useWindowWide from '@/hooks/useWindowWide';
import { useNavigate } from 'react-router';

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const mobileWidth = useWindowWide(768);
  const dispatch = useAppDispatch();
  const appointments = useAppSelector(state => state.appointment.appointments);
  const [filterState, dispatchFilterAction] = useReducer(filterReducer, initialFilterState);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(getMyAppointments());
  }, []);

  const meetingsForDay = appointments.map(appointment => ({
    date: dayjs(appointment.startedAt).toDate(),
    status: appointment.status.toUpperCase(),
  }));

  function handleSubmit(value: string) {
    setSearch(value);
  }

  const findDoctor = () => {
    navigate(`/doctors${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  };

  return (
    <section className=''>
      <PageHeader iconVariant='appointments' title='Appointments' className='flex-col gap-4 lg:flex-row'>
        <div className='flex w-full flex-col gap-4 sm:flex-row'>
          <InputSearch
            value={search}
            setValue={handleSubmit}
            variant='white'
            placeholder={`${mobileWidth ? 'Search by doctor, symptom' : 'Search by doctor'}`}
            className='w-full'
          />

          <Button
            onClick={findDoctor}
            type='primary'
            btnType='button'
            className='flex items-center justify-center whitespace-nowrap'
          >
            Find a doctor
          </Button>
        </div>
      </PageHeader>

      <section className='flex flex-col justify-between gap-6 lg:flex-row'>
        <div className='flex h-4/5 flex-1 flex-col gap-y-6'>
          <AppointmentsFilters state={filterState} dispatch={dispatchFilterAction} appointments={appointments} />
          {appointments.length === 0 ? (
            <NoAppointments findDoctor={() => navigate(`/doctors`)} />
          ) : (
            <AppointmentsList appointments={appointments} filters={filterState} />
          )}
        </div>

        <div className=''>
          <Calendar meetingsForDay={meetingsForDay} />
        </div>
      </section>
    </section>
  );
}
