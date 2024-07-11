import type { RefObject } from 'react';
import { useEffect } from 'react';

export const useClickOutside = <T extends HTMLElement>(ref: RefObject<T>, callback: () => void): void => {
  const handleClick = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      callback();
    }
  };

  const handleTouch = (event: TouchEvent) => {
    if (event.touches[0] && ref.current && !ref.current.contains(event.touches[0].target as Node)) {
      callback();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('touchend', handleTouch);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchend', handleTouch);
    };
  }, []);
};
