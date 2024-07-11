import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/hooks';
import { getMyAppointments } from '@/app/appointment/AppointmentThunks';
import type { IAppointment } from '@/dataTypes/Appointment';
import type { FilterState } from '../../filterReducer';
import { filterConfig } from '../AppointmentsFilters/AppointmentsFilters';
import AppointmentsListItem from './AppointmentsListItem';

type AppointmentsListProps = {
  filters: FilterState;
  appointments: IAppointment[];
};

function filterAppointments(appointment: IAppointment, filters: FilterState): boolean {
  const appointmentTime = dayjs.utc(appointment.startedAt).format('hh:mm a');
  const appointmentStatus = appointment.status
    .toLowerCase()
    .split('_')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const passesTimeFilter =
    filters.time.includes(filterConfig.time.defaultValue) || filters.time.includes(appointmentTime);

  const passesStatusFilter =
    filters.statuses.includes(filterConfig.statuses.defaultValue) || filters.statuses.includes(appointmentStatus);

  if (!appointment.doctor) return false;

  const fullName = `Dr. ${appointment.doctor!.firstName} ${appointment.doctor!.lastName}`;
  const passesDoctorFilter =
    filters.doctors.includes(filterConfig.doctors.defaultValue) || filters.doctors.includes(fullName);

  return passesTimeFilter && passesStatusFilter && passesDoctorFilter;
}

function sortAppointments(a: IAppointment, b: IAppointment, filters: FilterState): number {
  if (filters.order.includes('Latest to oldest')) {
    return dayjs(b.startedAt).valueOf() - dayjs(a.startedAt).valueOf();
  } else {
    return dayjs(a.startedAt).valueOf() - dayjs(b.startedAt).valueOf();
  }
}

export default function AppointmentsList({ filters, appointments }: AppointmentsListProps) {
  const dispatch = useAppDispatch();

  const [appointment, setAppointment] = useState<IAppointment>();
  const [filteredAppointments, setFilteredAppointments] = useState<IAppointment[]>([]);
  const [hasFetchedAppointments, setHasFetchedAppointments] = useState(false);

  useEffect(() => {
    setAppointment(appointments.find(app => app.id === appointment?.id));
  }, [appointments]);

  useEffect(() => {
    dispatch(getMyAppointments()).then(() => setHasFetchedAppointments(true));
  }, [appointments.length, dispatch]);

  useEffect(() => {
    if (hasFetchedAppointments) {
      const filtered = appointments
        .filter(app => filterAppointments(app, filters))
        .sort((a, b) => sortAppointments(a, b, filters));

      setFilteredAppointments(filtered);
    }
  }, [appointments, filters, hasFetchedAppointments]);

  return (
    <>
      <div className='no-scrollbar flex flex-1 flex-col gap-y-4 overflow-y-scroll p-1'>
        {filteredAppointments.map(appointment => (
          <li key={appointment.id} className='list-none'>
            <AppointmentsListItem appointment={appointment} />
          </li>
        ))}
      </div>
    </>
  );
}
