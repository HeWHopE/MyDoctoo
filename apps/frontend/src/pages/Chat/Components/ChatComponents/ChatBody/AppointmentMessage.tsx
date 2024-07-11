import { Icon } from '@/components/UI';
import type { TMessageAppointment } from '@/dataTypes/Chat';
import { cn } from '@/utils/cn';
import { formatDateChat } from '@/utils/formatDateChat';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useEffect } from 'react';
import { useAppointmentPopup } from '@/hooks/popups/useAppointmentPopup';
import { getAppointment } from '@/app/appointment/AppointmentThunks';

type AppointmentMessageProps = {
  appointment: Exclude<TMessageAppointment, null>;
  className?: string;
  onClickViewDetails?: (appointmentId: string) => void;
};

const AppointmentMessage = ({ appointment, className, onClickViewDetails = () => {} }: AppointmentMessageProps) => {
  const dispatch = useAppDispatch();
  const { openPopup, setAppointment } = useAppointmentPopup();
  const openedAppointment = useAppSelector(state => state.appointment.appointment);

  useEffect(() => {
    if (openedAppointment && openedAppointment.id === appointment.id) {
      setAppointment(openedAppointment);
    }
  }, [openedAppointment]);

  const handleOpenDetails = () => {
    onClickViewDetails(appointment.id);
    dispatch(getAppointment(appointment.id));
    openPopup(openedAppointment!);
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
      <div className='flex flex-wrap items-center justify-center gap-2'>
        <Icon variant='file' className='text-grey-1' />
        <span className=''>Appointment at {formatDateChat(appointment.startedAt, true)}</span>
        <span
          onClick={handleOpenDetails}
          className='cursor-pointer font-medium text-main underline underline-offset-2 transition-all hover:text-main-medium'
        >
          View details
        </span>
      </div>

      {/* <Button type='secondary' className='bg-white'>
        <div className='flex items-center gap-2'>
          <Icon variant='download' />
          <span>Download summary</span>
        </div>
      </Button> */}
    </div>
  );
};

export default AppointmentMessage;
