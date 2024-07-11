import { Icon } from '@/components/UI';

type InputFileProps = {
  handleFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputFile = ({ handleFileSelect = () => {} }: InputFileProps) => {
  return (
    <div className='group relative cursor-pointer self-end overflow-hidden'>
      <Icon variant='attach' className='pointer-events-none relative z-0 text-grey-2 group-hover:text-grey-1' />
      <input
        multiple
        accept='image/*, video/*, .pdf'
        onChange={handleFileSelect}
        type='file'
        className='input-file-pointer z-1 absolute inset-0 opacity-0'
      />
    </div>
  );
};

export default InputFile;
