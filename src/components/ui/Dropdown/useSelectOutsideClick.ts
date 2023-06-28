import { useState, useEffect } from 'react';

export const useSelectOutsideClick = (ref: any, initialState: boolean) => {
  const [isActive, setIsActive] = useState(initialState);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (ref?.current !== null && !ref?.current?.contains(event.target)) {
        setIsActive(!isActive);
      }
    };

    if (isActive) {
      window.addEventListener('click', onClick);
    }
    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [isActive, ref]);

  return [isActive, setIsActive] as const;
};
