'use client';

import clsx from 'clsx';
import IconArrowDown from 'public/down.svg';
import IconRight from 'public/right.svg';

import { useState } from 'react';

interface CardToggleProps {
  className?: string;
  children?: React.ReactNode;
  title: string;
}
export default function CardToggle({ className, children, title }: CardToggleProps) {
  const [isToggle, setIsToggle] = useState(false);

  const handleIsToggle = () => {
    setIsToggle((isToggle) => !isToggle);
  };

  return (
    <div
      className={clsx(
        'dark:header_cus header_cus_light rounded-lg border bg-paperLight py-2 p-4 dark:bg-darkGreen',
        className
      )}
    >
      <div onClick={handleIsToggle} className="flex cursor-pointer items-center justify-between">
        {title} {isToggle ? <IconRight /> : <IconArrowDown />}
      </div>
      <div
        className={clsx({
          hidden: isToggle
        })}
      >
        {children}
      </div>
    </div>
  );
}
