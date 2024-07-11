import { Icon } from '@UI/index';
import dayjs from 'dayjs';
import AppointmentBadges from '@/pages/Appointments/Components/AppointmentsList/ItemBadges';
import type { AppointmentStatus } from '@/dataTypes/Appointment';
import useWindowWide from '@/hooks/useWindowWide';

type PopupHeaderProps = { startTime: string; status: AppointmentStatus };

export default function PopupHeader({ startTime, status }: PopupHeaderProps) {
  const mobileWidth = useWindowWide(500);

  return (
    <div className={`${mobileWidth ? 'flex justify-between' : 'flex-col'}`}>
      <div className='flex items-center gap-x-3'>
        <Icon variant='date' className='h-10 w-10 rounded-full bg-background p-[6px] pb-2  text-main' />
        <span className='text-xl font-semibold  text-black'>{dayjs.utc(startTime).format('MMMM D, h:mm a')}</span>
      </div>

      <AppointmentBadges status={status} />
    </div>
  );
}
