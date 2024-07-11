import { cn } from '../../../utils/cn';

interface ToggleProps {
  selected: boolean;
  label: string;
  id: string;
  onSelectedChange: () => void;
}

export const Toggle = ({ selected, onSelectedChange, label, id }: ToggleProps) => {
  return (
    <div className='flex items-center gap-6 '>
      <label className='text-base font-medium text-main'>{label}</label>
      <button
        onClick={onSelectedChange}
        className={cn(`flex w-12 rounded-2xl p-0.5 transition-colors duration-300`, selected ? 'bg-main' : 'bg-grey-5')}
      >
        <div
          className={cn(
            `h-7 w-7 rounded-full bg-white transition-transform duration-300`,
            selected ? 'translate-x-4' : 'translate-0',
          )}
        />
      </button>
      <input type='checkbox' className='pointer-events-none hidden' defaultChecked={selected} id={id} />
    </div>
  );
};
