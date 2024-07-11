import { useEffect } from 'react';
import OptionalSelect from '../../../components/UI/Select/OptionalSelect';
import { getSpecializationsList } from '../../../app/specialization/SpecializationThunks';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { specializationsList } from '../../../app/specialization/SpecializationSlice';
import { Tag } from '../../../components/UI';
import { getAllHospitals } from '../../../app/hospital/HospitalThunks';
import BasicSelect from '../../../components/UI/Select/BasicSelect';
import type { IHospital } from '../../../dataTypes/Hospital';
import { DoctorStatus } from '../../../dataTypes/Doctor';
import type { Specialization } from '../../../dataTypes/Doctor';

export type DoctorFilters = {
  hospitalId?: string[];
  specializationId?: string[];
  availableFrom?: string;
  availableUntil?: string;
  status?: DoctorStatus;
};

const statusOptions = [
  {
    name: 'Available now',
    value: DoctorStatus.AVAILABLE_NOW,
  },
];

const timeFilteringOptions = [
  {
    name: '9:00am - 12:00pm',
    value: {
      from: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
      until: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
    },
  },
  {
    name: '12:00pm - 16:00pm',
    value: {
      from: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
      until: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    },
  },
  {
    name: '16:00pm - 20:00pm',
    value: {
      from: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
      until: new Date(new Date().setHours(20, 0, 0, 0)).toISOString(),
    },
  },
];

export const Filters = ({
  filters,
  setFilters,
}: {
  filters: DoctorFilters;
  setFilters: (filters: DoctorFilters) => void;
}) => {
  const dispatch = useAppDispatch();
  const specializations = useAppSelector(specializationsList);
  const hospitals = useAppSelector(state => state.hospital.data);

  useEffect(() => {
    dispatch(getSpecializationsList());
    dispatch(getAllHospitals());
  }, []);
  return (
    <div className='mt-4 xl:mt-6'>
      <div className='flex flex-wrap gap-2 xl:gap-4'>
        <BasicSelect
          onChange={id =>
            setFilters({
              ...filters,
              availableFrom: id !== null ? timeFilteringOptions[id as number].value.from : undefined,
              availableUntil: id !== null ? timeFilteringOptions[id as number].value.until : undefined,
            })
          }
          selectedOptionId={timeFilteringOptions.findIndex(
            option => option.value.from === filters.availableFrom && option.value.until === filters.availableUntil,
          )}
          options={timeFilteringOptions.map((option, index) => ({ id: index, name: option.name }))}
          placeholder='All time'
          classNameWrapper='w-full lg:w-fit'
          classNameButton='w-full lg:w-fit'
        />
        <BasicSelect
          onChange={id =>
            setFilters({
              ...filters,
              status: id !== null ? statusOptions[id as number].value : undefined,
            })
          }
          selectedOptionId={statusOptions.findIndex(option => option.value === filters.status)}
          options={statusOptions.map((option, index) => ({ id: index, name: option.name }))}
          placeholder='All statuses'
          classNameWrapper='w-full lg:w-fit'
          classNameButton='w-full lg:w-fit'
        />
        <OptionalSelect
          options={specializations}
          defaultOption='All doctors'
          setChosenOptions={selected => setFilters({ ...filters, specializationId: selected })}
          selectedOptions={filters.specializationId}
          classNameWrapper='w-full lg:w-fit'
          classNameButton='w-full lg:w-fit'
        />
        <OptionalSelect
          options={hospitals}
          defaultOption='All hospitals'
          setChosenOptions={selected => setFilters({ ...filters, hospitalId: selected })}
          selectedOptions={filters.hospitalId}
          classNameWrapper='w-full lg:w-fit'
          classNameButton='w-full lg:w-fit'
        />
      </div>
      <SelectedFilterTags
        filters={filters}
        setFilters={setFilters}
        hospitals={hospitals}
        specializations={specializations}
      />
    </div>
  );
};

type SelectedFilterTagsProps = {
  filters: DoctorFilters;
  setFilters: (filters: DoctorFilters) => void;
  hospitals: IHospital[];
  specializations: Specialization[];
};

function SelectedFilterTags({ filters, setFilters, hospitals, specializations }: SelectedFilterTagsProps) {
  const tags = [];
  if (filters.availableFrom && filters.availableUntil)
    tags.push(
      <Tag
        className='mr-2 xl:mr-4'
        icon
        text={
          timeFilteringOptions.find(
            option => option.value.from === filters.availableFrom && option.value.until === filters.availableUntil,
          )!.name
        }
        onClick={() => setFilters({ ...filters, availableFrom: undefined, availableUntil: undefined })}
      />,
    );
  if (filters.status)
    tags.push(
      <Tag
        className='mr-2 xl:mr-4'
        icon
        text={statusOptions.find(option => option.value === filters.status)!.name}
        onClick={() => setFilters({ ...filters, status: undefined })}
      />,
    );
  if (filters.hospitalId?.length)
    filters.hospitalId.forEach(id => {
      const hospital = hospitals.find(h => h.id === id);
      tags.push(
        <Tag
          className='mr-2 xl:mr-4'
          icon
          text={hospital!.name}
          key={hospital?.id}
          onClick={() => setFilters({ ...filters, hospitalId: filters.hospitalId?.filter(h => h !== id) })}
        />,
      );
    });
  if (filters.specializationId?.length)
    filters.specializationId.forEach(id => {
      const specialization = specializations.find(h => h.id === id);
      tags.push(
        <Tag
          className='mr-2 xl:mr-4'
          icon
          text={specialization!.name}
          key={specialization?.id}
          onClick={() => setFilters({ ...filters, specializationId: filters.specializationId?.filter(h => h !== id) })}
        />,
      );
    });
  return (
    <div className='mt-2 space-y-2'>
      {tags}
      {tags.length ? <button onClick={() => setFilters({})}>Clear all filters ({tags.length})</button> : null}
    </div>
  );
}
