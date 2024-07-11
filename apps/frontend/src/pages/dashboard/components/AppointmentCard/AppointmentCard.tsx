import { Button } from '@/components/UI/Button/Button';
import Icon from '@/components/UI/Icon/Icon';
import type { IAppointment } from '@/dataTypes/Appointment';
import dayjs from 'dayjs';
import ShortInfoCard from '../ShortInfoCard/ShortInfoCard';
import { useState } from 'react';
import CallPopup from '../../../../components/CallPopup/CallPopup';
import { type UserCombined } from '../../../VideoChat/SignalingChannel';

type AppointmentCardProps = {
  appointment: IAppointment;
  about: string;
  user: UserCombined;
  withQuickNotes: boolean;
};

export default function AppointmentCard({ appointment, user, withQuickNotes = false, about }: AppointmentCardProps) {
  const appointmentDate = dayjs.utc(appointment.startedAt).format('YYYY-MM-DDTHH:mm:ss');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const isLate = dayjs(appointmentDate).diff(dayjs(), 'minutes') <= 0;

  const handleJoinAppointment = () => {
    setIsPopupOpen(true);
  };

  return (
    <>
      <article className='flex w-full max-w-[646px] flex-col items-center justify-between gap-y-8 rounded-xl bg-background px-4 xl:flex-row xl:items-center'>
        <ShortInfoCard
          fullName={`${user.data.firstName} ${user.data.lastName}`}
          about={about}
          avatarKey={user.data.avatarKey}
          classNames='justify-center xl:justify-start xl:after:w-px xl:after:h-12 xl:after:bg-main-medium pl-0'
        />
        <div className='flex w-full flex-row items-center justify-center xl:justify-start'>
          {dayjs(appointmentDate).diff(dayjs.utc(), 'minutes', true) > 5 ? (
            <div className='flex items-center'>
              <p className='border-r border-main-medium pr-4 font-semibold'>{dayjs(appointmentDate).format('MMM D')}</p>
              <Icon variant='timer' className='ml-[8px] mr-[8px] size-6 shrink-0 text-grey-3' />
              <p>{dayjs(appointmentDate).format('h:mm A')}</p>
            </div>
          ) : (
            <div className='flex w-full flex-col items-center justify-between gap-4 sm:flex-row xl:justify-between'>
              <div className='flex items-center justify-center gap-2'>
                <Icon variant='timer' className={`h-6 w-6 shrink-0 ${isLate ? 'text-error' : 'text-[#FFC249]'}`} />
                <p
                  className={`font-semibold ${isLate ? 'text-error' : 'text-[#067C88]'}`}
                >{`Starts in ${isLate ? 0 : dayjs(appointmentDate).diff(dayjs(), 'minutes')} min`}</p>
              </div>
              {withQuickNotes ? <Icon variant='quick-notes' className='ml-[16px] text-[#067C88]' /> : <></>}
              <Button
                type={'primary'}
                onClick={handleJoinAppointment}
                className={`flex w-full items-center justify-center gap-2 sm:max-w-[148px] ${withQuickNotes ? 'w-fit px-2 ' : ''}`}
              >
                <div className={`${withQuickNotes ? '' : 'flex'} 'font-normal'`}>
                  {withQuickNotes ? <></> : <Icon variant='plus' />}
                  <p>Join now</p>
                </div>
              </Button>
            </div>
          )}
        </div>

        <CallPopup
          user={user}
          isPopupOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          appointmentId={appointment.id}
        />
      </article>
    </>
  );
}
