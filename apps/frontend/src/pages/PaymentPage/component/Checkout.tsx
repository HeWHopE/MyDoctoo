import dayjs from 'dayjs';
import { useAppSelector } from '@/app/hooks';
import { getHourDifference } from '@/utils/getHourDifference';
import type { IAppointment } from '@/dataTypes/Appointment';
import { AppointmentStatus } from '@/dataTypes/Appointment';
import { Icon, Tag } from '@/components/UI';

export const Checkout = () => {
  const { status, doctor, startedAt, endedAt } = useAppSelector(state => state.appointment.appointment) as IAppointment;

  const doctorName = `Dr. ${doctor?.firstName} ${doctor?.lastName}`;
  const formattedDate = dayjs(startedAt).format('MMM D, h:mm a');
  const doctorSpecializations = doctor?.specializations.map(item => item.name).join(', ');
  const appointmentDuration = getHourDifference(startedAt, endedAt);
  const pricePerHour = doctor?.payrate || 0;
  const appointmentStatus = status === AppointmentStatus.PENDING_PAYMENT ? 'waiting for payment' : '';

  return (
    <>
      <div className='grid w-full justify-items-start gap-2 rounded-xl bg-white p-6 text-black'>
        <div className='flex items-center gap-2'>
          <Icon variant='date' className='text-main' />
          <p className='text-lg font-semibold leading-6'>{formattedDate}</p>
        </div>
        <p className='mb-2 font-medium'>
          {doctorName} <br />
          <span className='lowercase'>({doctorSpecializations})</span>
        </p>
        <Tag icon={false} text={appointmentStatus} />
      </div>

      <div className='grid w-full gap-2'>
        <p className=' flex items-center justify-between gap-2 font-medium text-text'>
          {appointmentDuration} hour
          <span>${pricePerHour}</span>
        </p>
        <div className='grid grid-cols-2 grid-rows-[2px_27px] items-center justify-between gap-2 text-black before:col-start-1 before:col-end-3 before:h-px before:w-full before:bg-grey-4 before:content-[""]'>
          <p className='row-start-2 row-end-3 text-lg font-medium'>Total</p>
          <p className='row-2 justify-self-end text-lg font-medium'>${pricePerHour * appointmentDuration}</p>
        </div>
      </div>
    </>
  );
};
