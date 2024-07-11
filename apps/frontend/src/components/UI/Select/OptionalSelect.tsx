import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon/Icon';
import { Checkbox } from '../Checkbox/Checkbox';
import type { FieldValues, SubmitHandler } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import './OptionalSelect.css';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { cn } from '../../../utils/cn';

interface SelectProps {
  options: { id: string; name: string }[];
  defaultOption: string | '';
  setChosenOptions: (value: string[]) => void;
  selectedOptions?: string[];
  classNameWrapper?: string;
  classNameButton?: string;
}

const OptionalSelect: React.FC<SelectProps> = ({
  options,
  defaultOption,
  setChosenOptions,
  selectedOptions,
  classNameWrapper,
  classNameButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const methods = useForm({
    mode: 'onChange',
  });

  const onSubmit: SubmitHandler<FieldValues> = data => {
    const selectedOptionIds = Object.keys(data).filter(optionId => data[optionId]);

    setChosenOptions(selectedOptionIds);

    setIsOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit(methods.getValues());
  };

  useEffect(() => {
    for (const option of options) {
      const value = selectedOptions?.includes(option.id);
      methods.setValue(option.id, value);
    }
  }, [selectedOptions]);

  return (
    <div className={cn('relative min-w-fit', classNameWrapper)}>
      <button
        className={cn(
          'flex min-w-fit cursor-pointer items-center justify-between gap-3 whitespace-nowrap rounded-full bg-white px-4 py-1 text-base text-black hover:bg-grey-5 hover:text-main',
          classNameButton,
        )}
        onClick={() => setIsOpen(prev => !prev)}
        ref={dropdownRef}
      >
        {defaultOption || 'Select'}
        <Icon
          variant={`shevron-mini-${isOpen ? 'open' : 'closed'}`}
          className='h-6 w-6 text-grey-3'
          onClick={e => {
            e.stopPropagation();
            setIsOpen(prev => !prev);
          }}
        />
      </button>

      {isOpen && (
        <div>
          <div
            className='absolute z-50 mb-5 mt-2 flex w-fit min-w-[224px] justify-end rounded-md bg-white shadow-md'
            onClick={e => e.stopPropagation()}
          >
            <div className='mr-1 mt-4 min-w-[210px]'>
              <FormProvider {...methods}>
                <form onSubmit={handleFormSubmit}>
                  <div style={{ overflowY: 'auto' }} className='custom-scrollbar max-h-[150px]'>
                    {options.map(option => (
                      <div key={option.id}>
                        <ul>
                          <li
                            className={`mb-1 w-full rounded-md bg-white p-1 pl-3 text-left text-sm text-grey-1 hover:bg-grey-4 hover:text-main`}
                          >
                            <Checkbox id={option.id}>{option.name}</Checkbox>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className='mr-5 flex justify-end'>
                    <button
                      type='submit'
                      className='m-2 mb-2 cursor-pointer rounded-md bg-white pb-2 text-base font-medium text-main hover:text-main'
                    >
                      Apply
                    </button>
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionalSelect;
