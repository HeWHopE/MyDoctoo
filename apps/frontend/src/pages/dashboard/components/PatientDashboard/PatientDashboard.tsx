import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { useEffect, useState } from 'react';
import type { IAppointment } from '@/dataTypes/Appointment';
import { AppointmentStatus } from '@/dataTypes/Appointment';
import { Button, Calendar, InputSearch } from '@/components/UI';
import { getMyAppointments } from '@/app/appointment/AppointmentThunks';
import PageHeader from '@/pages/PageHeader';
import MyDoctorsCard from '../MyDoctorsCard/MyDoctorsCard';
import NearestAppointmentsComponent from '../NerestAppointmentsCard/NearestAppointments';
import { getMyDoctorData } from '@/app/doctor/DoctorThunks';
import useWindowWide from '@/hooks/useWindowWide';
import { useNavigate } from 'react-router';

const PatientDashboard = () => {
  const mobileWidth = useWindowWide(768);
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getMyDoctorData());
    dispatch(getMyAppointments());
  }, [dispatch]);

  function handleSubmit(value: string) {
    setSearch(value);
  }
  const doctors = useAppSelector(state => state.doctor.doctors);
  const appointments = useAppSelector(state => state.appointment.appointments);
  const nearestAppointments =
    appointments.length > 2
      ? [...appointments]
          .filter(a => a.status === AppointmentStatus.PLANNED)
          .sort((a: IAppointment, b: IAppointment) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
          .slice(0, 5)
      : [];

  const findDoctor = () => {
    navigate(`/doctors${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  };

  return (
    <div>
      <PageHeader iconVariant='dashboard' title='Dashboard' className='flex-col gap-4 lg:flex-row'>
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
      <div className='flex flex-col gap-6 lg:flex-row'>
        <section className='flex w-full flex-col gap-6 bg-background'>
          <NearestAppointmentsComponent appointments={nearestAppointments} />
          {/* <NotificationsComponent /> */}
        </section>
        <section className='flex flex-col gap-6'>
          <Calendar
            meetingsForDay={appointments.map((appointment: IAppointment) => ({
              date: new Date(appointment.startedAt),
              status: appointment.status,
            }))}
          />
          <MyDoctorsCard doctors={doctors} />
        </section>
      </div>
    </div>
  );
};

export default PatientDashboard;
