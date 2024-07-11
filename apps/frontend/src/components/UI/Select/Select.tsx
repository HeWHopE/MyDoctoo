import type React from 'react';
import { useFormContext } from 'react-hook-form';
import { Icon } from '..';

interface SelectProps {
  id: string;
  options: string[];
  defaultOption?: string | '';
  label?: string;
  classNameLabel?: string;
}

const Select: React.FC<SelectProps> = ({ options, defaultOption, label, id, classNameLabel }) => {
  const { register } = useFormContext();

  return (
    <div className='relative'>
      {label && (
        <label htmlFor={id} className={`${classNameLabel || ''} text-md my-2 block text-grey-2`}>
          {label}
        </label>
      )}
      <div className='relative h-fit w-full'>
        <Icon
          variant='shevron-mini-closed'
          className='pointer-events-none absolute right-4 top-1/2 z-50 -translate-y-1/2 text-grey-1'
        />
        <select
          {...register(id)}
          id={id}
          defaultValue={defaultOption || 'default'}
          onChange={e => console.log(e.target.value)}
          className='relative flex w-full max-w-[412px] cursor-pointer appearance-none items-center justify-between rounded-md 
          bg-grey-5 p-4 text-sm text-black transition-colors duration-300 hover:bg-grey-4 focus:border-none focus:outline-none'
        >
          {options.map((option, index) => (
            <>
              {index === 0 && (
                <option key='default' disabled>
                  Select
                </option>
              )}
              <option
                key={option}
                value={option}
                className={`mb-1 w-full cursor-pointer rounded-md border-none bg-grey-5 p-1 pl-3 text-left
                    text-sm first:mt-2 hover:bg-grey-4 hover:text-main focus:outline-none
                  `}
              >
                {option}
              </option>
            </>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Select;
