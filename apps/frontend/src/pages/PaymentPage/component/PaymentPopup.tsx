import { useNavigate } from 'react-router';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useAppSelector } from '@/app/hooks';
import { ReceiptPDF } from './ReceiptPDF';
import { Button, Icon, PopupDoctoo, Spinner } from '@/components/UI';
import { cn } from '@/utils/cn';
import type { IAppointment } from '@/dataTypes/Appointment';
import { getHourDifference } from '@/utils/getHourDifference';

interface PaymentPopupProps {
  isOpenModal: boolean;
  setIsOpenModal: (arg0: boolean) => void;
  isSuccessfulPayment: boolean;
  paymentDetails: {
    id: string;
    created: number;
  };
  isLoading: boolean;
}

export const PaymentPopup = ({
  isOpenModal,
  setIsOpenModal,
  isSuccessfulPayment,
  paymentDetails,
  isLoading,
}: PaymentPopupProps) => {
  const navigate = useNavigate();
  const { doctor, startedAt, endedAt } = useAppSelector(state => state.appointment.appointment) as IAppointment;
  const doctorName = `Dr. ${doctor?.firstName} ${doctor?.lastName}`;
  const appointmentDuration = getHourDifference(startedAt, endedAt);

  const navigateBack = () => {
    navigate('/dashboard');
    setIsOpenModal(false);
  };

  const closeModal = () => {
    window.history.back();
    setIsOpenModal(false);
  };

  return (
    <PopupDoctoo
      popupIsOpen={isOpenModal}
      closePopup={closeModal}
      modalFullClassName='max-w-[522px] p-10'
      modalBodyClassName=' '
    >
      <div className={cn('grid justify-items-start gap-4', isLoading && 'justify-items-center')}>
        {isLoading && <Spinner size={50} color='#089BAB' />}

        {!isLoading && isSuccessfulPayment && (
          <>
            <h2 className='text-black'>Success!</h2>
            <p>Your appointment have been successfully paid.</p>
            <div className='flex flex-col items-start gap-4 md:flex-row md:items-center'>
              <PDFDownloadLink
                document={
                  <ReceiptPDF
                    id={paymentDetails.id}
                    date={paymentDetails.created}
                    doctorName={doctorName}
                    appointmentDuration={appointmentDuration}
                    pricePerHour={doctor?.payrate || 0}
                  />
                }
                fileName='document.pdf'
                className='no-underline'
              >
                <Button
                  type='secondary'
                  btnType='button'
                  className='flex items-center justify-center gap-1 px-3 md:gap-2 md:px-6'
                >
                  <Icon variant='download' />
                  Download receipt
                </Button>
              </PDFDownloadLink>
              <Button type='primary' btnType='button' className='w-full md:w-fit' onClick={navigateBack}>
                Go to Dashboard
              </Button>
            </div>
          </>
        )}

        {!isLoading && !isSuccessfulPayment && (
          <>
            <h2 className='text-black'>Error!</h2>
            <p>Sorry, something went wrong there. Try again.</p>
            <Button type='secondary' btnType='button' onClick={() => setIsOpenModal(false)} className='w-full sm:w-fit'>
              Try again
            </Button>
          </>
        )}
      </div>
    </PopupDoctoo>
  );
};
