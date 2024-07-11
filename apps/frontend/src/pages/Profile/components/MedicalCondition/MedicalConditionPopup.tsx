import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createPatientAllergies, createPatientConditions } from '@/app/patient/PatientThunks';
import { Button, PopupDoctoo, Tag } from '@/components/UI';
import type { TAllergy } from '@/dataTypes/Allergy';
import type { TCondition } from '@/dataTypes/Condition';
import { useEffect, useState } from 'react';

type MedicalConditionPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

const MedicalConditionPopup = ({ isOpen, onClose }: MedicalConditionPopupProps) => {
  const conditions = useAppSelector(state => state.condition.data);

  const allergies = useAppSelector(state => state.allergy.data);

  const patient = useAppSelector(state => state.patient.data);

  const [conditionInput, setConditionInput] = useState('');
  const [allergyInput, setAllergyInput] = useState('');

  const dispatch = useAppDispatch();

  useEffect(() => {
    setAllConditions(conditions);
    setAllAllergies(allergies);
  }, [conditions, allergies]);

  const [allConditions, setAllConditions] = useState<TCondition[]>(conditions);
  const [suggestedConditions, setSuggestedConditions] = useState<TCondition[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<TCondition[]>([]);
  const [allAllergies, setAllAllergies] = useState<TAllergy[]>(allergies);
  const [suggestedAllergies, setSuggestedAllergies] = useState<TAllergy[]>([]);
  const [selectedAllergies, setSelectedAllergies] = useState<TAllergy[]>([]);

  return (
    <PopupDoctoo
      popupIsOpen={isOpen}
      closePopup={onClose}
      modalFullClassName='max-w-[612px]'
      modalBodyClassName='flex max-w-[516px] flex-col gap-7'
    >
      <p className='text-xl font-medium text-black sm:text-2xl'>Medical condition and allergies </p>
      <form onSubmit={e => e.preventDefault()} className='flex w-full flex-col gap-7'>
        <div className='grid gap-2 sm:gap-6'>
          <div>
            <label htmlFor='condition' className='text-md mb-2 flex text-grey-1'>
              Medical condition
            </label>
            <div className='box-border flex w-full flex-wrap rounded-lg bg-background pl-2 text-base text-text focus:outline-none'>
              {selectedConditions.map(condition => (
                <Tag
                  key={condition.id}
                  icon
                  text={condition.name}
                  className='my-2 ml-1'
                  onClick={() => {
                    setSelectedConditions(prev => prev.filter(c => c.id !== condition.id));
                    setAllConditions(prev => [...prev, condition]);
                  }}
                />
              ))}
              <input
                value={conditionInput}
                onChange={e => {
                  setConditionInput(e.target.value);
                  const value = e.target.value;

                  if (!value) return setSuggestedConditions([]);

                  allConditions.map(condition => {
                    if (suggestedConditions.some(c => c.name === condition.name)) {
                      return;
                    }

                    if (condition.name.toLowerCase().startsWith(value.toLowerCase()) && value.length > 0) {
                      setSuggestedConditions(prev => [...prev, condition]);
                    }
                  });
                }}
                id='condition'
                className='grow bg-transparent px-4 py-2 outline-none max-[400px]:w-full'
              />
            </div>
            {suggestedConditions.map(condition => (
              <Tag
                icon={false}
                key={condition.id}
                text={condition.name}
                className='my-2 ml-1'
                onClick={() => {
                  setSelectedConditions(prev => [...prev, condition]);
                  setAllConditions(prev => prev.filter(c => c.id !== condition.id));
                  setConditionInput('');
                  setSuggestedConditions([]);
                }}
              />
            ))}
          </div>

          <div>
            <label htmlFor='allergies' className='text-md mb-2 flex text-grey-1'>
              Allergies
            </label>
            <div className='box-border flex w-full flex-wrap rounded-lg bg-background pl-2 text-base text-text focus:outline-none'>
              {selectedAllergies.map(allergy => (
                <Tag
                  key={allergy.id}
                  icon
                  text={allergy.name}
                  className='my-2 ml-1'
                  onClick={() => {
                    setSelectedAllergies(prev => prev.filter(c => c.id !== allergy.id));
                    setAllAllergies(prev => [...prev, allergy]);
                  }}
                />
              ))}
              <input
                value={allergyInput}
                onChange={e => {
                  setAllergyInput(e.target.value);
                  const value = e.target.value;

                  if (!value) return setSuggestedAllergies([]);

                  allAllergies.map(allergy => {
                    if (suggestedAllergies.some(a => a.name === allergy.name)) {
                      return;
                    }

                    if (allergy.name.toLowerCase().startsWith(value.toLowerCase()) && value.length > 0) {
                      setSuggestedAllergies(prev => [...prev, allergy]);
                    }
                  });
                }}
                id='allergies'
                className='grow bg-transparent px-4 py-2 outline-none max-[400px]:w-full'
              />
            </div>
            {suggestedAllergies.map(allergy => (
              <Tag
                icon={false}
                key={allergy.id}
                text={allergy.name}
                className='my-2 ml-1'
                onClick={() => {
                  setSelectedAllergies(prev => [...prev, allergy]);
                  setAllAllergies(prev => prev.filter(c => c.id !== allergy.id));
                  setAllergyInput('');
                  setSuggestedAllergies([]);
                }}
              />
            ))}
          </div>
        </div>
        <div className='flex w-full flex-col-reverse gap-4 sm:flex-row'>
          <Button
            type='secondary'
            onClick={() => {
              setSelectedConditions([]);
              setSuggestedConditions([]);
              onClose();
            }}
            className='w-full sm:w-1/2'
          >
            Cancel
          </Button>
          <Button
            type='primary'
            onClick={() => {
              if (selectedConditions.length !== 0) {
                dispatch(createPatientConditions({ id: patient.id, body: selectedConditions }));
              }
              if (selectedAllergies.length !== 0) {
                dispatch(createPatientAllergies({ body: selectedAllergies, id: patient.id }));
              }
              onClose();
            }}
            className='w-full sm:w-1/2'
          >
            Save
          </Button>
        </div>
      </form>
    </PopupDoctoo>
  );
};

export default MedicalConditionPopup;
