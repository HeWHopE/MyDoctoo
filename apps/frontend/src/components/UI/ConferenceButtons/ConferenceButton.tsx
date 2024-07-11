import Icon from '@UI/Icon/Icon';
import type React from 'react';
import { useState } from 'react';
import { useOnClickOutside } from './hooks/useOnClickOutside';

export interface Option<T> {
  id: string;
  label: string;
  value: T;
}

type ConferenceButtonProps<T> = {
  children: React.ReactNode;
  onClick: (value: T) => void;
  classNames?: string;
  options: Option<T>[];
};

export const ConferenceButtons = <T,>({ options, children, onClick, classNames = '' }: ConferenceButtonProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
  const ref = useOnClickOutside(() => {
    setIsOpen(false);
  });

  const handleClick = (value: T) => {
    setIsOpen(false);
    onClick(value);
  };

  isOpen ? (classNames += 'bg-[#454f50] text-white') : classNames;
  return (
    <div className='relative inline-block text-left' ref={ref}>
      <div>
        <button
          type='button'
          className={`flex h-[86px] w-fit items-center rounded-md pl-4 pr-2 hover:bg-[#454f50] hover:text-white ${classNames}`}
          id='options-menu'
          aria-haspopup='true'
          aria-expanded='true'
          onClick={toggleDropdown}
        >
          <div className='flex flex-row  justify-center text-xs'>
            {children}
            <Icon variant='shevron-mini-closed' className='text-center' />
          </div>
        </button>
      </div>

      {isOpen && (
        <div className='absolute bottom-full right-0 mb-[2px] mt-2 w-fit min-w-[120px] origin-top-right rounded-md bg-[#454f50] text-white shadow-lg'>
          <div className='px-1 py-1' role='menu' aria-orientation='vertical' aria-labelledby='options-menu'>
            {options.map((o: Option<T>) => (
              <button
                key={o.id}
                className='text-gray-700 flex w-full rounded-[12px] px-4  py-2 text-xs hover:bg-[#202323]'
                role='menuitem'
                onClick={() => handleClick(o.value)}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
