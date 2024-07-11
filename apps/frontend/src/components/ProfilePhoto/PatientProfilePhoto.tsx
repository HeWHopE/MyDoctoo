import { Icon } from '../UI';

interface PatientProfilePhotoProps {
  photoURL: string | null;
  className?: string;
}

export const PatientProfilePhoto = ({ photoURL, className }: PatientProfilePhotoProps) => {
  return (
    <div
      className={`flex h-[92px] w-[92px] items-center justify-center overflow-hidden rounded-lg ${!photoURL && 'bg-background'} ${className}`}
    >
      {photoURL ? (
        <img src={photoURL} alt='avatar' className='h-full w-full object-contain' />
      ) : (
        <Icon variant='account' className='h-12 w-12 text-main' />
      )}
    </div>
  );
};
