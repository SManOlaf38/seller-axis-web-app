'use client';

import clsx from 'clsx';
import IconArrowDown from 'public/down.svg';
import IconRight from 'public/right.svg';
import PO from 'public/PO.svg';
import { useEffect, useState } from 'react';

interface CardToggleProps {
  className?: string;
  children?: React.ReactNode;
  title: string | React.ReactNode;
  disabled?: boolean;
  isShowContent?: boolean;
  classNameWrapChildren?: string;
  contentRight?: string | React.ReactNode;
  iconTitle?: React.ReactElement;
}
export default function CardToggle({
  className,
  children,
  title,
  disabled,
  classNameWrapChildren,
  contentRight,
  iconTitle = <PO />,
  isShowContent = true
}: CardToggleProps) {
  const [isToggle, setIsToggle] = useState(false);

  const handleIsToggle = () => {
    setIsToggle((isToggle) => !isToggle);
  };

  useEffect(() => {
    (disabled || !isShowContent) && setIsToggle(true);
  }, [disabled, isShowContent]);

  return (
    <div
      className={clsx(
        'dark:header_cus header_cus_light rounded-lg border bg-paperLight dark:bg-darkGreen',
        {
          'text-lightSecondary dark:text-mistBlue': disabled
        },
        className
      )}
    >
      <div
        onClick={disabled ? () => {} : handleIsToggle}
        className={clsx(
          'flex items-center justify-between rounded-lg bg-neutralLight px-4 py-2 dark:bg-gunmetal',
          {
            'cursor-pointer': !disabled
          }
        )}
      >
        <div className="flex items-center">
          {iconTitle}
          <div className="ml-2">{title}</div>
        </div>

        <div className="flex items-center">
          {contentRight && contentRight}
          {isToggle ? <IconRight /> : <IconArrowDown />}
        </div>
      </div>
      <div
        className={clsx('px-4 py-2', classNameWrapChildren, {
          hidden: isToggle
        })}
      >
        {children}
      </div>
    </div>
  );
}
