import type React from 'react';
import { useRef, useState } from 'react';
import Icon from '../Icon/Icon';
import './OptionalSelect.css';
import { useClickOutside } from '../../../hooks/useClickOutside';
import { cn } from '../../../utils/cn';

interface SelectProps {
  options: { id: string | number; name: string }[];
  placeholder?: string;
  onChange: (id: string | number | null) => void;
  selectedOptionId: string | number;
  classNameWrapper?: string;
  classNameButton?: string;
}

const BasicSelect: React.FC<SelectProps> = ({
  options,
  onChange,
  placeholder,
  selectedOptionId,
  classNameWrapper,
  classNameButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));
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
        {placeholder || 'Select'}
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
        <div
          className='absolute z-50 mb-5 mt-2 flex w-fit min-w-[224px] justify-end rounded-md bg-white shadow-md'
          onClick={e => e.stopPropagation()}
        >
          <div className='mb-2 mr-1 mt-3 min-w-[210px]'>
            <ul style={{ overflowY: 'auto' }} className='custom-scrollbar max-h-[150px]'>
              {options.map(option => {
                const isSelected = option.id === selectedOptionId;
                const onClick = () => {
                  const arg = isSelected ? null : option.id;
                  onChange(arg);
                  setIsOpen(false);
                };
                return (
                  <li
                    onClick={onClick}
                    key={option.id}
                    className={`mb-1 w-full rounded-md p-1 text-left text-base font-normal leading-6 ${isSelected ? 'bg-grey-3 hover:bg-grey-4' : 'bg-white hover:bg-grey-4'}`}
                  >
                    {option.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default BasicSelect;
