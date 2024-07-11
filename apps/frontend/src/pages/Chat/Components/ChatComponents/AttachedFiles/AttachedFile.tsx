import Icon from '@/components/UI/Icon/Icon';
import { Link } from 'react-router-dom';

type AttachedFileProps = {
  fileName: string;
};

const AttachedFile = ({ fileName }: AttachedFileProps) => {
  return (
    <Link
      to={`${import.meta.env.VITE_S3_BASE_URL}/${fileName}`}
      className='flex w-full items-center gap-2 rounded-lg bg-background p-2 no-underline'
    >
      <div className='inline-flex shrink-0 rounded-md bg-main p-1'>
        <Icon variant='file' className='text-white' />
      </div>
      <span className='break-all text-sm text-black'>{fileName}</span>
    </Link>
  );
};

export default AttachedFile;
