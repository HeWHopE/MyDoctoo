import { useEffect, useState } from 'react';
import { Calendar, Icon, InputSearch } from '../../components/UI';
import PageHeader from '../PageHeader';
import { getDoctorData } from '../../app/doctor/DoctorThunks';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Pagination } from '../../components/UI/Pagination/Pagination';
import { Filters } from './components/Filters';
import type { DoctorFilters } from './components/Filters';
import { Link, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { getMyAppointments } from '../../app/appointment/AppointmentThunks';
import { DoctorsList } from './components/DoctorsList';
import useWindowWide from '../../hooks/useWindowWide';

export const FindDoctorsPage = () => {
  const mobileWidth = useWindowWide(768);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const appointments = useAppSelector(state => state.appointment.appointments);
  const meetingsForDay = appointments.map(appointment => ({
    date: dayjs(appointment.startedAt).toDate(),
    status: appointment.status.toUpperCase(),
  }));
  const { doctors, totalCount } = useAppSelector(state => state.doctor);
  const [filters, setFilters] = useState<DoctorFilters>({});
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState(searchParams.get('search') || null);

  useEffect(() => {
    dispatch(getDoctorData({ search: search && search !== null ? search : undefined, page, ...filters }));
  }, [search, page, filters, appointments]);

  useEffect(() => {
    dispatch(getMyAppointments());
  }, []);
  return (
    <div className='h-dvh'>
      <Link to='/dashboard' className='mb-4 flex items-center text-sm font-medium no-underline'>
        <Icon variant='arrow-right' className='rotate-180 text-center' /> Back to Dashboard
      </Link>
      <div className='flex flex-col gap-2 bg-background lg:flex-row lg:gap-6'>
        <div className='shrink grow basis-4/5'>
          <PageHeader
            iconVariant='my-doctors'
            title='Best doctors available now'
            className='flex-col gap-4 lg:flex-row'
          >
            <span className='text-grey-1'>
              {(page - 1) * 10 + doctors.length} / {totalCount} results
            </span>
          </PageHeader>
          <InputSearch
            variant='white'
            value={search || ''}
            setValue={value => {
              setSearch(value);
              setSearchParams(prev => ({ ...prev, ...(value.length && { search: value }) }));
            }}
            classNameDiv='w-full xl:mt-6 md:mt-4'
            className='w-full'
            placeholder={mobileWidth ? 'Search by doctor, symptom' : 'Search by doctor'}
          />
          <Filters
            filters={filters}
            setFilters={filters => {
              setFilters(filters);
              setPage(1);
            }}
          />
          <DoctorsList doctors={doctors} />
          {doctors.length ? (
            <div className='mt-2 flex justify-center p-2 xl:mb-2'>
              <Pagination
                currentPage={page}
                itemsPerPage={10}
                onClick={pageNumber => {
                  setPage(pageNumber);
                  setSearchParams(prev => ({ ...prev, ...(pageNumber > 1 && { page: pageNumber }) }));
                }}
                totalItems={totalCount}
                wrapperClassName='bg-white p-2 rounded-lg space-x-3'
              />
            </div>
          ) : null}
        </div>
        <div className='mb-2 xl:mb-0'>
          <Calendar meetingsForDay={meetingsForDay} />
        </div>
      </div>
    </div>
  );
};
