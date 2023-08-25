import { useState, useEffect } from 'react';

export const useSelectOutsideClick = (ref: any, initialState: boolean) => {
  const [isActive, setIsActive] = useState<boolean>(initialState);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!ref?.current?.contains(event.target)) {
        setIsActive(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [ref]);

  return [isActive, setIsActive] as const;
};
