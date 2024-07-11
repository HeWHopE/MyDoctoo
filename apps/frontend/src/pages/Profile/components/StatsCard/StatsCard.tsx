import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { patchPatientData } from '@/app/patient/PatientThunks';
import type { TPatient } from '@/dataTypes/Patient';
import { capitalizeString } from '@/utils/capitalizeString';
import Icon from '@UI/Icon/Icon';
import type { IconVariant } from '@UI/Icon/types';
import { useState } from 'react';

type StatsCardProps = {
  iconVariant: IconVariant;
  value: string;
  variant: 'input' | 'select';
  title: 'Height, cm' | 'Weight, kg' | 'Age' | 'Gender' | 'Blood type';
  options?: string[];
};

function refactorBloodType(str: string) {
  switch (str) {
    case 'AB_MINUS':
      return 'AB-';
    case 'AB_PLUS':
      return 'AB+';
    case 'A_MINUS':
      return 'A-';
    case 'A_PLUS':
      return 'A+';
    case 'B_MINUS':
      return 'B-';
    case 'B_PLUS':
      return 'B+';
    case 'O_MINUS':
      return 'O-';
    case 'O_PLUS':
      return 'O+';
  }
}

const StatsCard = ({ title, iconVariant, value, variant, options }: StatsCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const patient = useAppSelector(state => state.patient.data);
  const [error, setError] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div className='flex w-full flex-col justify-between  rounded-lg bg-white p-3 pb-4 text-start md:p-7'>
      <div className='flex w-full justify-between gap-4 rounded-lg '>
        <div className='flex flex-col gap-4'>
          <p className='w-full text-grey-1'>{title}</p>
          <div className='group flex w-full items-center justify-between text-black'>
            <form onSubmit={e => e.preventDefault()}>
              {variant === 'input' && (
                <input
                  onBlur={() => {
                    switch (title) {
                      case 'Height, cm':
                        if (parseInt(inputValue) && parseInt(inputValue) > 50 && parseInt(inputValue) <= 300) {
                          dispatch(patchPatientData({ id: patient.id, body: { height: parseInt(inputValue) } }));
                          setError(false);
                        } else {
                          setError(true);
                        }

                        break;

                      case 'Weight, kg':
                        if (parseInt(inputValue) && parseInt(inputValue) > 30 && parseInt(inputValue) <= 1000) {
                          dispatch(patchPatientData({ id: patient.id, body: { weight: parseInt(inputValue) } }));
                          setError(false);
                        } else {
                          setError(true);
                        }

                        break;

                      case 'Age':
                        if (parseInt(inputValue) && parseInt(inputValue) > 18 && parseInt(inputValue) <= 130) {
                          dispatch(patchPatientData({ id: patient.id, body: { age: parseInt(inputValue) } }));
                          setError(false);
                        } else {
                          setError(true);
                        }

                        break;
                    }
                  }}
                  className={`w-fit rounded-md border ${error ? ' border-error' : 'border-transparent'} bg-white text-center font-medium outline-none`}
                  disabled={!isEditing}
                  defaultValue={value}
                  size={1}
                  onChange={e => setInputValue(e.target.value)}
                />
              )}

              {variant === 'select' && (
                <div>
                  <select
                    defaultValue={value}
                    onChange={e => {
                      setInputValue(e.target.value);
                      setIsEditing(false);
                      let gender: TPatient['gender'] | null = null;
                      let bloodType: TPatient['bloodType'] | null = null;
                      switch (title) {
                        case 'Gender':
                          switch (inputValue.toLowerCase()) {
                            case 'female':
                              gender = 'FEMALE';
                              break;
                            case 'male':
                              gender = 'MALE';
                              break;
                          }

                          if (gender) dispatch(patchPatientData({ id: patient.id, body: { gender } }));
                          break;
                        case 'Blood type':
                          switch (inputValue.toLowerCase()) {
                            case 'ab_minus':
                              bloodType = 'AB_MINUS';
                              break;
                            case 'ab_plus':
                              bloodType = 'AB_PLUS';
                              break;
                            case 'a_minus-':
                              bloodType = 'A_MINUS';
                              break;
                            case 'a_plus':
                              bloodType = 'A_PLUS';
                              break;
                            case 'b_minus':
                              bloodType = 'B_MINUS';
                              break;
                            case 'b_plus':
                              bloodType = 'B_PLUS';
                              break;
                            case 'o_minus':
                              bloodType = 'O_MINUS';
                              break;
                            case 'o_plus':
                              bloodType = 'O_PLUS';
                              break;
                          }
                          if (bloodType) dispatch(patchPatientData({ id: patient.id, body: { bloodType } }));
                          break;
                      }
                    }}
                    className={`${isEditing ? 'pointer-events-auto' : 'pointer-events-none'} appearance-none bg-white outline-none`}
                  >
                    {options &&
                      title === 'Gender' &&
                      options.map((option, index) => (
                        <option key={index} value={option}>
                          {capitalizeString(option.toLowerCase())}
                        </option>
                      ))}
                    {options &&
                      title === 'Blood type' &&
                      options.map((option, index) => (
                        <option key={index} value={option}>
                          {refactorBloodType(option)}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </form>

            <Icon
              onClick={() => setIsEditing(!isEditing)}
              variant='edit'
              className='cursor-pointer text-lg text-grey-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100'
            />
          </div>
        </div>
        <div className='h-fit rounded-lg bg-background p-2 text-grey-1 '>
          <Icon variant={iconVariant} className='h-7 w-7' />
        </div>
      </div>
      {error && <p className=' w-full text-[16px] text-error'>Invalid value</p>}
    </div>
  );
};

export default StatsCard;
