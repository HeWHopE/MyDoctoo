import OptionalSelect from '@/components/UI/Select/OptionalSelect';
import type { FilterState, FilterAction } from '../../filterReducer';
import type { IAppointment } from '@/dataTypes/Appointment';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import AppointmentsSelectButton from './AppointmentsSelectButton';

function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

type AppointmentsFiltersProps = {
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  appointments: IAppointment[];
};

type FilterConfig = {
  [key: string]: {
    defaultValue: string;
    getOptions: (appointments: IAppointment[]) => string[];
  };
};

const OLDEST_TO_LATEST = 'Oldest to latest';
const LATEST_TO_OLDEST = 'Latest to oldest';

export const filterConfig: FilterConfig = {
  time: {
    defaultValue: 'All time',
    getOptions: (appointments: IAppointment[]) => [
      ...new Set(appointments.map(appointment => dayjs.utc(appointment.startedAt).format('hh:mm a'))),
    ],
  },
  statuses: {
    defaultValue: 'All statuses',
    getOptions: (appointments: IAppointment[]) => [...new Set(appointments.map(appointment => appointment.status))],
  },
  doctors: {
    defaultValue: 'All doctors',
    getOptions: (appointments: IAppointment[]) => [
      ...new Set(
        appointments
          .filter(appointment => appointment.doctor)
          .map(appointment => `Dr. ${appointment.doctor!.firstName} ${appointment.doctor!.lastName}`),
      ),
    ],
  },
  order: {
    defaultValue: 'Latest to oldest',
    getOptions: () => [LATEST_TO_OLDEST, OLDEST_TO_LATEST],
  },
};

export default function AppointmentsFilters({ state, dispatch, appointments }: AppointmentsFiltersProps) {
  const filterTypeToActionType: Record<string, FilterAction['type']> = {
    time: 'SET_TIME',
    statuses: 'SET_STATUSES',
    doctors: 'SET_DOCTORS',
    order: 'SET_ORDER',
  };

  const optionsForFilterType = useMemo(() => {
    const options: Record<string, { id: string; name: string }[]> = {};

    for (const filterType of Object.keys(filterTypeToActionType)) {
      const filterOptions = filterConfig[filterType].getOptions(appointments);
      options[filterType] = filterOptions.map((option, index) => ({
        id: `${filterType}-${index}`,
        name: filterType === 'statuses' ? toTitleCase(option) : option,
      }));
    }

    return options;
  }, [appointments]);

  const displayValues = useMemo(() => {
    const values: Record<string, string> = {};

    for (const filterType of Object.keys(filterTypeToActionType)) {
      const selectedOptions = state[filterType as keyof FilterState];
      const allOptions = optionsForFilterType[filterType].map(option => option.name);

      values[filterType] =
        selectedOptions.length === allOptions.length
          ? filterConfig[filterType].defaultValue
          : selectedOptions.length > 1
            ? 'Click to see filters'
            : selectedOptions[0];
    }

    return values;
  }, [state, optionsForFilterType]);

  function handleFilterChange(filterType: string, selectedOptionIds: string[]) {
    const actionType = filterTypeToActionType[filterType];

    if (actionType) {
      const selectedOptions = selectedOptionIds.map(id => {
        const option = optionsForFilterType[filterType].find(option => option.id === id);
        return option ? option.name : id;
      });
      const payload = selectedOptions.length > 0 ? selectedOptions : [filterConfig[filterType].defaultValue];
      dispatch({ type: actionType, payload });
    }
  }

  return (
    <div className='flex flex-wrap gap-4'>
      {Object.keys(filterTypeToActionType).map(filterType => {
        if (filterType === 'order') {
          return (
            <AppointmentsSelectButton
              key={filterType}
              defaultOption={displayValues[filterType]}
              setChosenOption={selectedOption => handleFilterChange(filterType, [selectedOption])}
            />
          );
        } else {
          return (
            <OptionalSelect
              key={filterType}
              options={optionsForFilterType[filterType]}
              defaultOption={displayValues[filterType]}
              setChosenOptions={selectedOptions => handleFilterChange(filterType, selectedOptions)}
            />
          );
        }
      })}
    </div>
  );
}
