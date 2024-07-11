import OptionalSelect from '@/components/UI/Select/OptionalSelect';
import type { IDoctor } from '@/dataTypes/Doctor';
import { useMemo } from 'react';
import type { FilterAction, FilterState } from './filterReducer';

interface MyDoctorsFilterProps {
  doctors: IDoctor[];
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
}

type FilterConfig = {
  [key: string]: {
    defaultValue: string;
    getOptions: (doctors: IDoctor[]) => string[];
  };
};

function getSpecializationsArray(doctors: IDoctor[]) {
  const allSpecs: string[] = [];
  doctors.forEach((doctor: IDoctor) => {
    doctor.specializations.forEach(spec => {
      allSpecs.push(spec.name);
    });
  });
  return allSpecs;
}

function getHospitalsArray(doctors: IDoctor[]) {
  const allHospitals: string[] = [];
  doctors.forEach((doctor: IDoctor) => {
    doctor.hospitals.forEach(hospital => {
      allHospitals.push(hospital.name);
    });
  });
  return allHospitals;
}

export const filterConfig: FilterConfig = {
  doctors: {
    defaultValue: 'All doctors',
    getOptions: (doctors: IDoctor[]) => [
      ...new Set(doctors.map(doctor => `Dr. ${doctor!.firstName} ${doctor.lastName}`)),
    ],
  },
  specializations: {
    defaultValue: 'All specializations',
    getOptions: (doctors: IDoctor[]) => [...new Set(getSpecializationsArray(doctors))],
  },
  hospitals: {
    defaultValue: 'All hospitals',
    getOptions: (doctors: IDoctor[]) => [...new Set(getHospitalsArray(doctors))],
  },
};

const MyDoctorsFilters = ({ state, dispatch, doctors }: MyDoctorsFilterProps) => {
  const filterTypeToActionType: Record<string, FilterAction['type']> = {
    doctors: 'SET_DOCTORS',
    specializations: 'SET_SPECIALIZATIONS',
    hospitals: 'SET_HOSPITALS',
  };

  const optionsForFilterType = useMemo(() => {
    const options: Record<string, { id: string; name: string }[]> = {};

    for (const filterType of Object.keys(filterTypeToActionType)) {
      const filterOptions = filterConfig[filterType].getOptions(doctors);
      console.log(filterOptions);
      options[filterType] = filterOptions.map((option, index) => ({
        id: `${filterType}-${index}`,
        name: option,
      }));
    }

    return options;
  }, [doctors]);

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
        return (
          <OptionalSelect
            key={filterType}
            options={optionsForFilterType[filterType]}
            defaultOption={displayValues[filterType]}
            setChosenOptions={selectedOptions => handleFilterChange(filterType, selectedOptions)}
          />
        );
      })}
    </div>
  );
};

export default MyDoctorsFilters;
