import { cn } from '@/utils/cn';
import { useFormContext } from 'react-hook-form';

interface CheckboxProps {
  children: React.ReactNode;
  id: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  errorMessage?: string;
}

export const Checkbox = ({
  children,
  id,
  required = false,
  disabled = false,
  className,
  errorMessage,
}: CheckboxProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const hasError = errors[id];

  return (
    <>
      <div className='flex items-center gap-2'>
        <input
          {...register(id, {
            required: required,
          })}
          type='checkbox'
          className={cn(
            className || '',
            'hover:(not disabled:border-2) focus:(not disabled:border-2) grid h-6 w-6 cursor-pointer appearance-none place-content-center rounded border border-solid border-main bg-white p-1 before:h-6 before:w-6 before:scale-0 before:bg-[url("/assets/checkmark.svg")] before:transition-[120ms] before:duration-[transform] before:content-[""] checked:bg-main checked:before:scale-100 checked:hover:border-main-dark checked:hover:bg-main-dark disabled:cursor-not-allowed disabled:border-grey-4 checked:disabled:bg-grey-4',
          )}
          disabled={disabled}
        />
        <div className={cn('text-base font-normal leading-6', disabled ? 'text-grey-4' : 'text-text')}>{children}</div>
      </div>

      {hasError && errorMessage && <p className='text-sm font-normal leading-[17px] text-error'>{errorMessage}</p>}
    </>
  );
};
