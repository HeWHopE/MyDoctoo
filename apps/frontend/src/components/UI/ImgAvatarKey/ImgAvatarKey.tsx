import { useState, type FC } from 'react';
import Icon from '../Icon/Icon';
import { cn } from '../../../utils/cn';

const ImgAvatarKey: FC<{
  avatarKey?: string | null;
  hasBackground?: boolean;
  className?: string;
  alt?: string;
}> = ({ avatarKey, className, hasBackground = false, alt }) => {
  const [error, setError] = useState(false);
  const url = avatarKey !== '' ? `${import.meta.env.VITE_S3_BASE_URL}/${avatarKey}` : null;

  if (url && !error)
    return (
      <img
        src={url}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null;
          setError(true);
        }}
        alt={alt || 'avatar'}
        className={cn('h-full w-full object-contain', className)}
      />
    );
  if (hasBackground) {
    return (
      <div className={cn('aspect-square h-3/5 rounded-xl bg-black-2 p-5 text-grey-4')}>
        <Icon variant='account' className={cn('aspect-square h-full w-full text-main', className)} />
      </div>
    );
  }
  return <Icon variant='account' className={cn('aspect-square h-full w-full text-main', className)} />;
};

export default ImgAvatarKey;
