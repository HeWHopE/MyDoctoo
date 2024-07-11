import { type FC } from 'react';
import { Button, Icon, PopupDoctoo } from '../UI';
import ImgAvatarKey from '../UI/ImgAvatarKey/ImgAvatarKey';
import { type IconVariant } from '../UI/Icon/types';
import { useNavigate } from 'react-router';
import { type UserCombined } from '../../pages/VideoChat/SignalingChannel';
import { cn } from '../../utils/cn';
import { Role } from '../../dataTypes/User';
import { useMedia } from '../../pages/VideoChat/useMedia';

const CallPopup: FC<{
  isPopupOpen: boolean;
  onClose: () => void;
  user: UserCombined;
  appointmentId: string;
}> = ({ isPopupOpen, onClose, user, appointmentId }) => {
  const navigate = useNavigate();
  const { isAudioOn, isVideoOn, handleVideoToggle, handleAudioToggle, videoRef, close } = useMedia({
    withAudioOn: false,
    withVideoOn: false,
    request: isPopupOpen,
  });

  const handleOnJoin = () => {
    close();
    navigate(`/video-call/${appointmentId}`, {
      state: { doctor: user, appointmentId, settings: { withAudioOn: isAudioOn, withVideoOn: isVideoOn } },
    });
  };

  const handleDeclineCall = () => {
    close();
    onClose();
  };

  return (
    <PopupDoctoo
      popupIsOpen={isPopupOpen}
      closePopup={handleDeclineCall}
      modalBodyClassName={''}
      modalFullClassName='max-w-[700px]'
    >
      <div className='flex flex-col items-center gap-4 space-y-5 p-8 align-middle'>
        <div className='flex'>
          <ImgAvatarKey className='h-[200px] w-[200px]' avatarKey={user.data.avatarKey} />
          <video
            ref={videoRef}
            className={cn('h-[200px] w-[200px] rounded-xl bg-main-medium object-cover', !isVideoOn && 'hidden')}
            autoPlay
            muted={!isAudioOn}
          />
        </div>
        <div className='text-center'>
          <h3 className='pb-1'>
            {user.role === Role.DOCTOR && 'Dr.'} {user.data.firstName} {user.data.lastName}
          </h3>
          <p>is waiting for you. Ready to join the call?</p>
        </div>
        <div className='flex gap-4'>
          <IconToggle onClick={handleAudioToggle} isFirst={!isAudioOn} firstIcon='muted' secondIcon='mute' />
          <IconToggle onClick={handleVideoToggle} isFirst={!isVideoOn} firstIcon='video-stopped' secondIcon='video' />
          <Icon
            onClick={handleDeclineCall}
            className='h-12 w-12 cursor-pointer rounded-full bg-error p-2 text-white'
            variant='leave-the-call'
          />
        </div>
        <Button
          onClick={handleOnJoin}
          type='primary'
          className='flex w-full max-w-[200px] items-center justify-center gap-4'
        >
          <Icon variant='join-the-call' />
          Join now
        </Button>
      </div>
    </PopupDoctoo>
  );
};

const IconToggle: FC<{
  onClick: () => void;
  isFirst: boolean;
  firstIcon: IconVariant;
  secondIcon: IconVariant;
}> = ({ onClick, isFirst, firstIcon, secondIcon }) => {
  return (
    <Icon
      onClick={onClick}
      variant={isFirst ? firstIcon : secondIcon}
      className='h-12 w-12 cursor-pointer rounded-full bg-main-light p-2 text-main-medium'
    />
  );
};

export default CallPopup;
