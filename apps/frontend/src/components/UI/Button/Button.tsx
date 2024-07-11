import { cn } from '../../../utils/cn';
import { ButtonTypes } from './ButtonTypes';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  type: `${ButtonTypes}`;
  btnType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
};

export const Button = ({
  children,
  onClick,
  disabled = false,
  className = '',
  type,
  btnType = 'button',
}: ButtonProps) => {
  const ButtonTypeStyles = {
    [ButtonTypes.PRIMARY]: `text-white ${disabled ? 'bg-grey-3' : 'bg-main hover:bg-main-dark active:bg-main-darker'}`,
    [ButtonTypes.SECONDARY]: `bg-transparent border-2 ${disabled ? 'border-grey-3 text-grey-3' : 'border-main text-main hover:border-main-dark hover:text-main-dark active:border-main-darker active:text-main-darker'}`,
    [ButtonTypes.WARN]: `text-white ${disabled ? 'bg-error' : 'bg-error hover:bg-error-dark active:bg-error-darker'}`,
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={btnType}
      className={cn(
        ButtonTypeStyles[type],
        'h-10 min-w-[100px] rounded-md px-6 transition-colors duration-300',
        className,
      )}
    >
      {children}
    </button>
  );
};
