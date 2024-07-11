import { Icon } from '../UI';

interface OptionToChangeProfilePhotoProps {
  photoURL: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeletePhoto: () => void;
}

export const OptionToChangeProfilePhoto = ({
  photoURL,
  handleFileChange,
  handleDeletePhoto,
}: OptionToChangeProfilePhotoProps) => {
  return photoURL ? (
    <div className='flex flex-col gap-2 min-[690px]:flex-row'>
      <label
        htmlFor='file'
        className='flex cursor-pointer items-center gap-2 text-base font-medium leading-6 text-main'
      >
        <Icon variant='change' />
        Change photo
        <input id='file' type='file' accept='image/*' onChange={handleFileChange} className='hidden' />
      </label>
      <button className='flex items-center gap-2 text-base font-medium text-grey-1' onClick={handleDeletePhoto}>
        <Icon variant='delete' />
        Delete photo
      </button>
    </div>
  ) : (
    <label htmlFor='file' className='cursor-pointer text-base font-medium leading-6 text-main'>
      Upload photo
      <input id='file' type='file' accept='image/*' onChange={handleFileChange} className='hidden' />
    </label>
  );
};
