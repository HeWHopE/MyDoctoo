import { useRef, useState } from 'react';
import { Icon } from '@/components/UI';
import { useClickOutside } from '../../../../hooks/useClickOutside';

interface AppointmentsSelectButtonProps {
  defaultOption: string;
  setChosenOption: (value: 'Oldest to latest' | 'Latest to oldest') => void;
}

const AppointmentsSelectButton = ({ defaultOption, setChosenOption }: AppointmentsSelectButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const dropdownRef = useRef(null);
  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: 'Oldest to latest' | 'Latest to oldest') => {
    setSelectedOption(option);
    setChosenOption(option);
    setIsOpen(false);
  };

  return (
    <div className='relative'>
      <button
        className='flex cursor-pointer items-center gap-3 whitespace-nowrap rounded-full bg-white 
        p-1 pl-3 text-base text-black hover:bg-grey-5 hover:text-main'
        onClick={handleClick}
        ref={dropdownRef}
      >
        {selectedOption}
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
        <div className='absolute mb-5 mt-2 flex w-[224px] justify-end rounded-md bg-white shadow-md'>
          <div className='h- mr-1 mt-4 w-[210px]'>
            <ul className='cursor-pointer'>
              <li
                className={`mb-1 w-full rounded-md bg-white p-1 pl-3 text-left text-sm text-grey-1 hover:text-main`}
                onClick={() => handleOptionClick('Oldest to latest')}
              >
                Oldest to latest
              </li>
              <li
                className={`mb-1 w-full rounded-md bg-white p-1 pl-3 text-left text-sm text-grey-1 hover:text-main`}
                onClick={() => handleOptionClick('Latest to oldest')}
              >
                Latest to oldest
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsSelectButton;
