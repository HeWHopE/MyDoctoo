import { useState } from 'react';
import { useAppSelector } from '@/app/hooks';
import { Button, Icon } from '@/components/UI';
import AddressInfoPopup from './AddressInfoPopup';
import { capitalizeString } from '@/utils/capitalizeString';

const AddressInfo = () => {
  const patient = useAppSelector(state => state.patient.data);

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className='flex h-full flex-col justify-between gap-4 rounded-xl bg-white p-3 md:p-7'>
      <div className='flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
        <h3 className='text-lg font-medium text-black'>Address</h3>
        {!patient.country && (
          <Button
            type='secondary'
            onClick={() => setIsOpen(!isOpen)}
            className='flex w-3/4 items-center justify-center gap-2 sm:max-w-[140px]'
          >
            <Icon variant='plus' />
            Add
          </Button>
        )}
      </div>
      {patient.country && (
        <div className='flex items-center justify-between'>
          <address className='not-italic'>
            {patient.country && capitalizeString(patient.country)}
            {patient.state && ', ' + capitalizeString(patient.state)}
            {patient.city && ', ' + capitalizeString(patient.city)}
            {patient.street && ', ' + capitalizeString(patient.street)}
            {patient.apartment && ', ' + patient.apartment}
          </address>

          <button className='flex gap-1 text-grey-1' onClick={() => setIsOpen(!isOpen)}>
            <Icon variant='edit' />
            Edit
          </button>
        </div>
      )}

      <AddressInfoPopup isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default AddressInfo;
