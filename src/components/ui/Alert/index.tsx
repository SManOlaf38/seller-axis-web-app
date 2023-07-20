'use client';

import { forwardRef, useState } from 'react';
import clsx from 'clsx';

import ErrorIcon from 'public/error.svg';
import SuccessIcon from 'public/success.svg';
import WarningIcon from 'public/warning.svg';
import CloseIcon from 'public/close.svg';

import { styles } from './Alert.styles';
import { AlertProps } from './Alert.types';
import useInterval from '@/hooks/useInterval';

const alertIcons = {
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  success: <SuccessIcon />
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      color = 'error',
      variant = 'contained',
      icon = true,
      title,
      description,
      action,
      width = 'auto',
      open = true,
      closeButton = false,
      floating = false,
      autoHideDuration = 0,
      placement = {
        horizontal: 'right',
        vertical: 'bottom'
      },
      zIndex = null,
      className,
      style,
      onClose,
      ...rest
    },
    ref
  ) => {
    const allClassNames = clsx(
      styles.base,
      styles.colors[color][variant],
      closeButton && 'xs:pr-12',
      className
    );
    const [timer, setTimer] = useState<number>(0);
    const [pause, setPause] = useState<boolean>(false);

    useInterval(() => {
      if (!open) return;

      if (!pause) {
        setTimer((prevState) => prevState + 1);

        if (autoHideDuration && timer === autoHideDuration / 1000) {
          onClose && onClose();
        }
      }
    });

    return (open && (
      <div
        className={clsx(
          'min-w-[364px] transform animate-slideInLeft',
          floating && styles.placements[placement.horizontal],
          floating && styles.placements[placement.vertical],
          floating && 'fixed p-4',
          !zIndex && floating && 'z-sticky'
        )}
        style={{
          ...(zIndex && { zIndex }),
          ...style
        }}
        ref={ref}
        {...rest}
      >
        <div
          className={allClassNames}
          onMouseEnter={() => setPause(true)}
          onMouseLeave={() => setPause(false)}
        >
          <div className="flex items-start">
            <div className="px-[8px] py-[4px]">
              {typeof icon === 'boolean' ? icon && alertIcons[color] : icon}
            </div>

            <div>
              <span className="text-[16px] font-semibold leading-6">{title}</span>
              <p className="text-[16px] font-normal leading-[18px]">{description}</p>
            </div>
            {action}
          </div>
          {closeButton && (
            <button
              type="button"
              className="absolute right-4 top-3"
              onClick={() => onClose && onClose()}
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </div>
    )) as JSX.Element;
  }
);

Alert.displayName = 'Alert';

export default Alert;
