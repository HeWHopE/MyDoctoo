import Icon from '@UI/Icon/Icon';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface InputPasswordProps {
  id: string;
  label?: string;
  errorMessage?: string;
  placeholder?: string;
  className?: string;
  classNameInput?: string;
  classNameLabel?: string;
}

const InputPassword = ({
  id,
  label,
  placeholder,
  errorMessage,
  className,
  classNameInput,
  classNameLabel,
}: InputPasswordProps) => {
  const [inputType, setInputType] = useState('password');
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const handleTogglePassword = () => {
    setInputType(inputType === 'password' ? 'text' : 'password');
  };

  const hasError = errors[id];

  return (
    <div className={`${className || ''} grid`}>
      {label && (
        <label htmlFor={id} className={`${classNameLabel || ''} text-md my-2 block text-grey-2`}>
          {label}
        </label>
      )}
      <div className='grid'>
        <input
          {...register(id)}
          type={inputType}
          className={`${classNameInput || ''} col-start-1 row-start-1 w-full rounded-lg border border-transparent bg-background py-2 pl-4 pr-10 text-base text-text hover:border-text focus:border-text focus:outline-none ${hasError && 'border-solid border-error'}`}
          placeholder={placeholder}
        />

        <button
          type='button'
          className='col-start-1 row-start-1 mr-2 self-center justify-self-end text-grey-2'
          onClick={handleTogglePassword}
        >
          <Icon variant={`${inputType === 'password' ? 'eye-closed' : 'eye-open'}`} />
        </button>
      </div>

      {hasError && errorMessage && <p className='mt-2 text-sm font-normal leading-[17px] text-error'>{errorMessage}</p>}
    </div>
  );
};

export default InputPassword;
