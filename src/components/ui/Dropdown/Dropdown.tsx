'use client';
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

import { useSelectOutsideClick } from './useSelectOutsideClick';

interface IProp {
  mainMenu?: string | React.ReactElement;
  children?: React.ReactNode;
  className?: string;
  classButton?: string;
  isClose?: boolean;
  onClick?: (value: boolean) => void;
}
export default function Dropdown(props: IProp) {
  const { mainMenu, children, className, classButton, isClose, onClick } =
    props;

  const dropdownRef = useRef(null);
  const [isActive, setIsActive] = useSelectOutsideClick(dropdownRef, false);

  const onHandleOpen = () => {
    setIsActive(!isActive);
  };

  if (isClose && isActive) {
    setIsActive(!isActive);
  }

  useEffect(() => {
    if (onClick) {
      onClick(isActive);
    }
  }, [isActive, onClick]);

  return (
    <div ref={dropdownRef} className='w-full relative'>
      <button
        type="button"
        onClick={onHandleOpen}
        className={clsx(
          classButton,
          'w-full flex items-center gap-2 rounded-lg text-center text-sm font-medium opacity-90',
        )}
      >
        {mainMenu}
      </button>
      <div
        onClick={onHandleOpen}
        id="dropdown"
        className={clsx(
          className,
          ' bg-gunmetal absolute right-0 z-10 mt-2 origin-top-right rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ',
          { ['hidden']: !isActive, ['block']: isActive },
        )}
      >
        {children}
      </div>
    </div>
  );
}
