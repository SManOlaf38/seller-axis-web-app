import { forwardRef, useState } from 'react';
import clsx from 'clsx';

import { styles } from './Alert.styles';
import { AlertProps } from './Alert.types';
import useInterval from '@/hooks/useInterval';
import Image from 'next/image';

const alertIcons = {
  error: <Image width={20} height={20} priority src="/error.svg" alt="error" />,
  warning: <Image width={20} height={20} priority src="/warning.svg" alt="warning" />,
  success: <Image width={20} height={20} priority src="/success.svg" alt="success" />
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
              <Image width={20} height={20} priority src="/close.svg" alt="close" />
            </button>
          )}
        </div>
      </div>
    )) as JSX.Element;
  }
);

Alert.displayName = 'Alert';

export default Alert;
