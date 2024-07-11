import { PatientProfilePhoto } from '@/components/ProfilePhoto/PatientProfilePhoto';
import { useRef, useState } from 'react';

type AppointmentCardProps = {
  fullName: string;
  avatarKey: string;
  about?: string;
  eventTime?: string;
  classNames: string | undefined;
  id?: string;
  onClick?: (item: any) => void;
};

export default function ShortInfoCard({
  fullName,
  avatarKey,
  eventTime,
  classNames,
  about,
  id,
  onClick,
}: AppointmentCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  const checkOverflow = () => {
    const element = textRef.current;
    if (element) {
      const fullText = about ? about : '';
      const textNode = document.createTextNode(fullText);
      element.appendChild(textNode);

      if (element.scrollWidth > element.clientWidth) {
        setShowTooltip(true);
      } else {
        setShowTooltip(false);
      }

      element.removeChild(textNode);
    }
  };

  const photoURL = avatarKey !== '' ? `${import.meta.env.VITE_S3_BASE_URL}/${avatarKey}` : null;

  return (
    <>
      <div
        className={`${classNames} relative flex w-full max-w-[261px] flex-row items-center gap-x-4 px-4 py-2`}
        onClick={onClick ? () => onClick(id) : undefined}
      >
        <PatientProfilePhoto className='h-8 w-8 rounded-lg md:h-12 md:w-12 ' photoURL={photoURL} />
        <div className='flex w-full max-w-[166px] flex-col py-[8px]'>
          <p className='font-semibold leading-6'>{fullName}</p>
          <div className='flex w-full'>
            <div
              ref={textRef}
              className='flex w-full flex-row overflow-hidden whitespace-nowrap text-sm font-medium leading-5 text-grey-1'
              onMouseEnter={checkOverflow}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <span className='truncate'>{about}</span>
              {eventTime ? (
                <p className='ml-auto mr-0 text-sm font-medium leading-5 text-grey-1'>{eventTime}</p>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div
            className={`absolute left-[198px] top-11 z-10 flex w-28 cursor-default rounded bg-black bg-opacity-75 p-2 text-sm text-white transition-all duration-200 ${showTooltip ? 'visible opacity-100' : 'invisible opacity-0'}`}
          >
            {about}
          </div>
        </div>
      </div>
    </>
  );
}
