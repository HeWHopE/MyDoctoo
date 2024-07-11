import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import MedicalConditionPopup from './MedicalConditionPopup';
import { Icon } from '@/components/UI';

const MedicalCondition = () => {
  const patient = useAppSelector(state => state.patient.data);
  const { conditions, allergies } = patient;

  const declaration = useAppSelector(state => state.declaration.data[0]);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className='flex h-full flex-col justify-between gap-4 rounded-xl bg-white p-3 md:p-7'>
        <div className='flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <p className='text-grey-1'>Declaration number</p>
          <div className='rounded-lg bg-main-light  px-4 py-2 font-medium text-black'>
            {declaration && declaration.id ? declaration.id : '-'}
          </div>
        </div>

        <div className='flex w-full flex-col items-start justify-between sm:flex-row sm:items-center'>
          <div className='flex flex-col gap-1 text-start'>
            <p className='text-grey-1'>Medical condition</p>
            <p className='font-medium text-text'>
              {conditions.length === 0 && '-'}
              {conditions.length !== 0 &&
                conditions.map((condition, index) => {
                  if (index !== conditions.length - 1) {
                    return `${condition.name}, `;
                  }
                  return condition.name;
                })}
            </p>
          </div>
          <button
            className='flex items-center gap-2 self-end text-sm text-grey-1 sm:self-start'
            onClick={() => setIsOpen(!isOpen)}
          >
            <Icon variant={'edit'} />
            Edit
          </button>
        </div>

        <div className='flex w-full flex-col items-start justify-between text-start sm:flex-row sm:items-center'>
          <div className='flex flex-col gap-1'>
            <p className='text-grey-1'>Allergies</p>
            <p className='font-medium text-text'>
              {allergies.length === 0 && '-'}
              {allergies.length !== 0 &&
                allergies.map((allergy, index) => {
                  if (index !== allergies.length - 1) {
                    return `${allergy.name}, `;
                  }
                  return allergy.name;
                })}
            </p>
          </div>
        </div>
      </div>
      <MedicalConditionPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default MedicalCondition;
