import { Icon } from '../UI';

interface PatientIdentityCardPhotoProps {
  photoURL: string | null;
  className?: string;
}

export const PatientIdentityCardPhoto = ({ photoURL, className }: PatientIdentityCardPhotoProps) => {
  return (
    <div
      className={`mb-5 flex h-[185px] w-[405px] items-center justify-center overflow-hidden rounded-lg ${!photoURL && 'bg-background'} ${className}`}
    >
      {photoURL ? (
        <img src={photoURL} alt='document' className='h-full w-full object-contain' />
      ) : (
        <Icon variant='account' className='h-12 w-12 text-main' />
      )}
    </div>
  );
};
