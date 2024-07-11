import type { ChangeEvent } from 'react';
import type React from 'react';
import Icon from '@UI/Icon/Icon';

interface InputSearchProps {
  variant: 'white' | 'grey';
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  className?: string;
  classNameDiv?: string;
}

const InputSearch: React.FC<InputSearchProps> = ({
  variant,
  value,
  setValue,
  placeholder,
  className,
  classNameDiv,
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClearInput = () => {
    setValue('');
  };

  return (
    <div className={`relative ${classNameDiv}`}>
      <Icon
        variant='search'
        className='absolute left-3 top-[20px] size-[22px] -translate-y-1/2 transform text-grey-2'
      />
      <input
        type='text'
        className={`h-10 cursor-pointer rounded-lg border border-transparent px-4 py-2 pl-10 pr-10 text-base leading-6 text-text hover:border-green-border focus:border-green-border focus:outline-none ${variant === 'white' ? 'bg-white' : 'bg-background'} ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={e => handleInputChange(e)}
      />
      {value !== '' && (
        <Icon
          variant='close'
          className='absolute right-3 top-[21px] size-[24px] -translate-y-1/2 transform cursor-pointer text-grey-2'
          onClick={handleClearInput}
        />
      )}
    </div>
  );
};

export default InputSearch;
