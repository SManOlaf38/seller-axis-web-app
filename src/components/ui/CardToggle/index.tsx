'use client';

import clsx from 'clsx';
import IconArrowDown from 'public/down.svg';
import IconRight from 'public/right.svg';

import { useEffect, useState } from 'react';

interface CardToggleProps {
  className?: string;
  children?: React.ReactNode;
  title: string | React.ReactNode;
  disabled?: boolean;
}
export default function CardToggle({ className, children, title, disabled }: CardToggleProps) {
  const [isToggle, setIsToggle] = useState(false);

  const handleIsToggle = () => {
    setIsToggle((isToggle) => !isToggle);
  };

  useEffect(() => {
    disabled && setIsToggle(true);
  }, [disabled]);

  return (
    <div
      className={clsx(
        'dark:header_cus header_cus_light rounded-lg border bg-paperLight p-4 py-2 dark:bg-darkGreen',
        {
          'text-lightSecondary dark:text-mistBlue': disabled
        },
        className
      )}
    >
      <div
        onClick={disabled ? () => {} : handleIsToggle}
        className={clsx('flex items-center justify-between', {
          'cursor-pointer': !disabled
        })}
      >
        {title} {isToggle ? <IconRight /> : <IconArrowDown />}
      </div>
      <div
        className={clsx('overflow-y-auto', {
          hidden: isToggle
        })}
      >
        {children}
      </div>
    </div>
  );
}
