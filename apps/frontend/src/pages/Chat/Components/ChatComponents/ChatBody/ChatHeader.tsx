import { Icon } from '@/components/UI';
import type { TParticipant } from '@/dataTypes/Chat';
import { cn } from '@/utils/cn';
import { useState, type ReactNode } from 'react';

type ChatHeaderProps = {
  participant: TParticipant;
  beforeChildren?: ReactNode;
  afterChildren?: ReactNode;
};

const ChatHeader = ({ participant, beforeChildren, afterChildren }: ChatHeaderProps) => {
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <div className='flex flex-shrink-0 items-center justify-between gap-2 p-5'>
      {beforeChildren}
      <div className='flex flex-1 flex-shrink-0 items-center gap-2'>
        <div
          className={cn(
            'avatar size-12 overflow-hidden rounded-lg max-md:size-10 max-sm:size-8',
            !participant ? 'bg-grey-1' : '',
          )}
        >
          {participant.avatarKey && imageLoaded ? (
            <img
              src={`${import.meta.env.VITE_S3_BASE_URL}/${participant.avatarKey}`}
              alt={participant.avatarKey}
              className='size-full object-cover'
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(false)}
            />
          ) : (
            <Icon variant='account' className='size-full text-main' />
          )}
        </div>
        <div className='grid flex-1 gap-1'>
          <div className='truncate text-lg font-bold text-black max-md:text-base'>
            {participant ? `${participant?.firstName} ${participant?.lastName}` : `Participant`}
          </div>
          {participant && 'specializations' in participant && participant.specializations!.length ? (
            <div className='truncate text-base font-normal text-black-2 max-md:text-sm'>
              {participant.specializations!.join(', ')}
            </div>
          ) : null}
        </div>
        {afterChildren}
      </div>
    </div>
  );
};

export default ChatHeader;
