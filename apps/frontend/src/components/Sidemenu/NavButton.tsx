import type { Path } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Icon from '@UI/Icon/Icon';
import type { IconVariant } from '@UI/Icon/types';
import { cn } from '../../utils/cn';
import { useEffect, useRef, useState } from 'react';

type NavButtonProps = {
  to: string | Partial<Path>;
  iconVariant: IconVariant;
  text: string;
  variant?: 'small' | 'large';
  selected?: boolean;
  parentRef?: React.RefObject<HTMLElement>;
};

const NavButton: React.FunctionComponent<NavButtonProps> = ({
  to,
  iconVariant,
  text,
  variant = 'large',
  selected = false,
  parentRef,
}) => {
  const navButtonRef = useRef<HTMLAnchorElement>(null);
  const [tooltipTop, setTooltipTop] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (navButtonRef.current) {
        const rect = navButtonRef.current.getBoundingClientRect();
        setTooltipTop(rect.top);
      }
    };
    if (parentRef?.current) {
      parentRef.current.addEventListener('scroll', handleScroll);
    } else {
      handleScroll();
    }
    return () => {
      if (parentRef?.current) {
        parentRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [navButtonRef, parentRef]);

  const isMobileOrTouch = window.matchMedia('(hover: none)').matches;
  return (
    <Link
      ref={navButtonRef}
      to={to}
      className={cn(
        variant !== 'small' ? 'flex w-full rounded-xl p-4' : 'inline-flex rounded-lg p-3',
        'group items-center justify-start gap-2 no-underline transition-all',
        selected && 'text-dark bg-white',
        !selected && 'text-white hover:bg-main-dark',
      )}
    >
      <Icon
        variant={iconVariant}
        className={cn(
          'size-6 transition-all',
          selected && 'text-main',
          !selected && 'text-white group-hover:text-white',
          iconVariant === 'notifications' && 'h-[26px] w-[26px]',
        )}
      />
      {variant !== 'small' && (
        <span className={cn('font-medium', !selected && 'group-hover:text-white', selected && 'text-black')}>
          {text}
        </span>
      )}
      {
        // tooltip
        !isMobileOrTouch && (
          <div className='absolute' style={{ top: tooltipTop }}>
            <div className='relative left-10 top-1 z-10'>
              {variant === 'small' && (
                <span className='z-100 invisible absolute left-full  ml-1 whitespace-nowrap rounded-xl bg-main-dark p-2 text-white transition-all group-hover:visible'>
                  {text}
                </span>
              )}
            </div>
          </div>
        )
      }
    </Link>
  );
};

export default NavButton;
