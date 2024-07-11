import { forwardRef, useState, type FC } from 'react';
import { useAppSelector } from '../../app/hooks';
import { Button, Icon, PopupDoctoo } from '../../components/UI';
import { useVideoCall } from './useVideoCall';
import { cn } from '../../utils/cn';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { type IDoctor } from '../../dataTypes/Doctor';
import ImgAvatarKey from '../../components/UI/ImgAvatarKey/ImgAvatarKey';
import { ClinicalNotes } from '../../components/ClinicalNotes/ClinicalNotes';

export const PatientVideoChatPage = () => {
  const patient = useAppSelector(state => state.patient.data);
  const { state } = useLocation();
  const doctor = state?.doctor as IDoctor;
  const settings: {
    withAudioOn: boolean;
    withVideoOn: boolean;
  } = state?.settings || { withAudioOn: false, withVideoOn: false };

  const navigate = useNavigate();

  const { conferenceId } = useParams();
  if (!conferenceId) return <Navigate to='/dashboard' replace />;

  const handleCallEnd = () => {
    navigate(`/video-call/ended/${conferenceId}`, { state: { doctor } });
  };

  return (
    <VideoChat
      conferenceId={conferenceId}
      userId={patient.id}
      avatarKey={patient.avatarKey}
      onCallEnd={handleCallEnd}
      memberPrefix='Dr.'
      myDisplayName={`${patient.firstName} ${patient.lastName} (You)`}
      withAudioOn={settings.withAudioOn}
      withVideoOn={settings.withVideoOn}
      appointmentId={state?.appointmentId}
    />
  );
};

export const DoctorVideoChatPage = () => {
  const doctor = useAppSelector(state => state.doctor.doctorUser)!;
  const { state } = useLocation();
  const settings: {
    withAudioOn: boolean;
    withVideoOn: boolean;
  } = state?.settings || { withAudioOn: false, withVideoOn: false };

  const navigate = useNavigate();

  const { conferenceId } = useParams();
  if (!conferenceId) return <Navigate to='/dashboard' replace />;

  const handleCallEnd = () => {
    navigate('/dashboard');
  };

  return (
    <VideoChat
      conferenceId={conferenceId}
      userId={doctor.id}
      avatarKey={doctor.avatarKey}
      onCallEnd={handleCallEnd}
      myDisplayName={`${doctor.firstName} ${doctor.lastName} (You)`}
      withAudioOn={settings.withAudioOn}
      withVideoOn={settings.withVideoOn}
      appointmentId={state?.appointmentId}
    />
  );
};

interface VideoChatProps {
  onCallEnd: () => void;
  myDisplayName: string;
  conferenceId: string;
  userId: string;
  avatarKey: string;
  memberPrefix?: string;
  withVideoOn?: boolean;
  withAudioOn?: boolean;
  appointmentId?: string;
}

const VideoChat: FC<VideoChatProps> = ({
  onCallEnd,
  myDisplayName,
  conferenceId,
  userId,
  memberPrefix = '',
  avatarKey,
  withAudioOn = false,
  withVideoOn = false,
  appointmentId,
}) => {
  const {
    error,
    isRemoteVideoOn,
    localRef,
    remoteRef,
    leaveCall,
    joinedMemebers,
    toggleVideo,
    toggleAudio,
    shareScreen,
    isScreenSharing,
    isAudioOn,
    isVideoOn,
  } = useVideoCall({ conferenceId, userId, withAudioOn, withVideoOn });
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [recording, setRecording] = useState(false);

  const [isIAmSpeaking] = useState(true);
  const [isOtherSpeaking] = useState(false);
  const [isLeavePopupOpen, setLeavePopupOpen] = useState(false);

  const joinedMember = joinedMemebers[0];

  const handleToggleVideo = () => {
    toggleVideo();
  };

  const handleToggleMute = () => {
    toggleAudio();
  };

  const handleScreenShare = () => {
    shareScreen();
  };

  const handleChatClick = () => {
    setShowChat(!showChat);
    if (!showChat) setShowNotes(false);
  };

  const handleRecording = () => {
    setRecording(!recording);
  };

  const handleQuickNotesClick = () => {
    setShowNotes(!showNotes);
    if (!showNotes) setShowChat(false);
  };

  const handleShowSubtitles = () => {
    setShowSubtitles(!showSubtitles);
  };

  const handleLeaveCall = () => {
    onCallEnd();
    leaveCall();
    setLeavePopupOpen(false);
  };

  if (error && error.length) {
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <div className='flex h-full w-full flex-col overflow-auto md:flex-row'>
      <div className='flex h-full min-h-full flex-grow flex-col overflow-auto'>
        <div className='flex flex-grow -translate-y-0 flex-col justify-center overflow-auto p-5 md:-translate-y-7'>
          <div className={cn('mt-6 flex justify-end pb-6', !recording && 'hidden')}>
            <RecordingIndicator isRecoording />
          </div>
          <div className='flex flex-col justify-between gap-4 md:flex-row'>
            <VideoComponent
              ref={remoteRef}
              isSpeaking={isOtherSpeaking}
              name={`${memberPrefix} ${joinedMember?.data?.firstName} ${joinedMember?.data?.lastName}`}
              showSubtitles={showSubtitles}
              isHidden={!joinedMember}
              isVideoOn={isRemoteVideoOn}
              avatarKey={joinedMember?.data?.avatarKey}
            />
            <VideoComponent
              muted
              ref={localRef}
              isSpeaking={isIAmSpeaking}
              name={myDisplayName}
              avatarKey={avatarKey}
              isVideoOn={isVideoOn || isScreenSharing}
            />
          </div>
        </div>

        <div className='flex min-h-fit flex-col flex-wrap items-center justify-between overflow-auto bg-black px-8 md:flex-row'>
          <div className='flex gap-4'>
            <VideoButton
              onClick={handleToggleMute}
              variant={isAudioOn ? 'mute' : 'muted'}
              label={isAudioOn ? 'Mute' : 'Unmute'}
            />
            <VideoButton
              onClick={handleToggleVideo}
              variant={isVideoOn ? 'video' : 'video-stopped'}
              label={isVideoOn ? 'Stop video' : 'Start video'}
            />
          </div>

          <div className='flex flex-wrap items-center justify-center gap-4 align-middle'>
            <VideoButton selected={showChat} onClick={handleChatClick} variant={'chats'} label={'Chat'} />
            <VideoButton onClick={handleScreenShare} variant={'share-screen'} label={'Share screen'} />
            <VideoButton selected={recording} onClick={handleRecording} variant={'record'} label={'Record'} />
            <VideoButton
              selected={showSubtitles}
              onClick={handleShowSubtitles}
              variant={'subtitles'}
              label={'Subtitles'}
            />
            <VideoButton
              selected={showNotes}
              onClick={handleQuickNotesClick}
              variant={'quick-notes'}
              label={'Quick notes'}
            />
          </div>

          <Button type='warn' onClick={() => setLeavePopupOpen(true)} className='flex items-center gap-2'>
            <Icon variant='leave-the-call' className='h-6 w-6 text-grey-5' />
            Leave
          </Button>
        </div>
      </div>
      {showChat && <div className='sticky top-0 w-[360px] min-w-[360px] bg-background'>Chat</div>}
      {showNotes && (
        <ClinicalNotes
          appointmentId={appointmentId!}
          className='sticky top-0 w-full md:h-[92vh] md:w-[360px] md:min-w-[360px] md:overflow-y-scroll'
        />
      )}

      <PopupDoctoo
        popupIsOpen={isLeavePopupOpen}
        closePopup={() => setLeavePopupOpen(false)}
        modalFullClassName='max-w-[700px]'
        modalBodyClassName={''}
      >
        <h2 className='pb-5'>You are leaving the call</h2>
        <p>You’ll receive full invoice for this appointment. Do you still want to leave the call?</p>

        <div className='mt-9 flex gap-4'>
          <Button type='secondary' onClick={() => setLeavePopupOpen(false)}>
            Return to the call
          </Button>
          <Button className='flex items-center gap-2' type='warn' onClick={handleLeaveCall}>
            <Icon variant='leave-the-call' className='h-6 w-6 text-grey-5' />
            Leave the call
          </Button>
        </div>
      </PopupDoctoo>
    </div>
  );
};

const VideoButton: FC<{
  onClick?: () => void;
  label?: string;
  selected?: boolean;
  variant:
    | 'mute'
    | 'muted'
    | 'video'
    | 'video-stopped'
    | 'chats'
    | 'share-screen'
    | 'record'
    | 'subtitles'
    | 'quick-notes';
}> = ({ onClick, variant, label, selected = false }) => (
  <button
    onClick={onClick}
    className={cn(
      'font-xs my-[10px] flex h-[60px] w-[80px] flex-col items-center justify-center gap-1  rounded-xl font-medium text-white',
      selected && 'bg-black-2',
    )}
  >
    <Icon variant={variant} className='h-6 w-6 text-grey-5' />
    {label && <span className='text-xs'>{label}</span>}
  </button>
);

type VideoComponentProps = {
  isSpeaking: boolean;
  name: string;
  showSubtitles?: boolean;
  isHidden?: boolean;
  isVideoOn?: boolean;
  avatarKey: string;
  muted?: boolean;
};

// eslint-disable-next-line react/display-name
const VideoComponent = forwardRef<HTMLVideoElement, VideoComponentProps>(
  ({ isSpeaking, name, showSubtitles = false, isHidden = false, muted = false, isVideoOn = true, avatarKey }, ref) => {
    return (
      <div className={cn('flex flex-1 items-center justify-center', isHidden ? 'hidden' : 'block')}>
        <div className='relative m-auto aspect-video max-h-[calc(100vh-250px)]'>
          <div className='absolute left-0 top-0 z-10 rounded-xl bg-main p-2'>
            <p className='text-white'>{name}</p>
          </div>
          {showSubtitles && (
            <div className='absolute bottom-0 left-0 z-10 flex w-full items-center gap-4 rounded-xl bg-main p-2'>
              <Icon variant='subtitles' className='h-6 w-6 text-white' />
              <p className='text-white'>Subtitles</p>
            </div>
          )}
          <video
            ref={ref}
            autoPlay
            playsInline
            muted={muted}
            className={cn(
              'aspect-video h-full w-full rounded-xl border-4 bg-black  object-cover',
              isSpeaking ? 'border-main' : 'border-transparent',
              isVideoOn ? 'block' : 'hidden',
            )}
          />
          <div
            className={cn(
              'aspect-video h-full w-full rounded-xl border-4 bg-black object-cover',
              isSpeaking ? 'border-main' : 'border-transparent',
              !isVideoOn ? 'flex items-center justify-center ' : 'hidden',
            )}
          >
            <ImgAvatarKey avatarKey={avatarKey} className={cn('text-grey-4')} hasBackground />
          </div>
        </div>
      </div>
    );
  },
);

const RecordingIndicator: FC<{
  isRecoording: boolean;
  onStopClick?: () => void;
  onPauseClick?: () => void;
  className?: string;
}> = ({ isRecoording, onStopClick, onPauseClick, className }) => {
  if (!isRecoording) return null;
  return (
    <div className={cn(' flex w-[320px] justify-between rounded-xl bg-background px-4 py-3 ', className)}>
      <div className='flex items-center gap-2'>
        <div className='h-[7px] w-[7px] rounded bg-error' />
        <p>Recording in progress</p>
      </div>

      <div className='flex gap-2'>
        <Button onClick={onStopClick} type='secondary' className='aspect-square h-8 min-w-0 border-[1px] px-0'>
          <Icon variant='stop' className='m-auto' />
        </Button>
        <Button onClick={onPauseClick} type='secondary' className='aspect-square h-8 min-w-0 border-[1px] px-0'>
          <Icon variant='pause' className='m-auto' />
        </Button>
      </div>
    </div>
  );
};
