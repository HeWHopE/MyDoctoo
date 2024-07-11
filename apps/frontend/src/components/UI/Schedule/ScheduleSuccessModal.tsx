import { Button } from '../Button/Button';
import PopupDoctoo from '../Popup/Popup';
import type { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router';

type ScheduleSuccessModalProps = { popupIsOpen: boolean; closePopup: () => void; date: Dayjs | null };

export default function ScheduleSuccessModal({ popupIsOpen, closePopup, date }: ScheduleSuccessModalProps) {
  const navigate = useNavigate();
  const formattedDate = date?.format('ddd, MMM D [at] h:mm A');

  function goToDashboard() {
    navigate('/dashboard');
    closePopup();
  }

  return (
    <PopupDoctoo
      closePopup={closePopup}
      popupIsOpen={popupIsOpen}
      modalBodyClassName='flex flex-col gap-y-8'
      modalFullClassName='max-w-[588px]'
    >
      <div className='flex flex-col gap-y-4'>
        <h2 className='text-2xl font-medium leading-9 text-black'>Success!</h2>

        <span className='text-base font-normal text-text'>
          Your appointment have been scheduled on <span className='font-semibold'>{formattedDate}.</span> You’ll receive
          a notification before an appointment and an invoice after.
        </span>
      </div>

      <div className='flex gap-x-4'>
        <Button btnType='button' type='secondary' onClick={closePopup}>
          Book next appointment
        </Button>
        <Button btnType='button' type='primary' onClick={goToDashboard}>
          Go to Dashboard
        </Button>
      </div>
    </PopupDoctoo>
  );
}
