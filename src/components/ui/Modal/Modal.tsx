import Image from 'next/image';
import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';

interface IProp {
  className?: string;
  title?: string;
  children: React.ReactNode;
  open: boolean;
  width?: string;
  isClose?: boolean;
  onClose: () => void;
}
export default function Modal({
  className,
  title,
  children,
  open,
  isClose,
  width,
  onClose,
}: IProp) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        if (open) {
          onClose();
        }
      }
    }
    function handleOutside(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        if (open) {
          onClose();
        }
      }
    }
    window.addEventListener('keyup', handleOutside);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keyup', handleOutside);
    };
  }, [onClose, open, ref]);

  return (
    <div
      className={`h-modal fixed left-0 right-0  top-0 z-50 ${open ? 'block' : 'hidden'
        } h-full items-center justify-center overflow-y-auto  overflow-x-hidden bg-night bg-opacity-90 md:inset-0`}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className={clsx(width, 'relative w-[514px] md:h-auto bg-darkGreen rounded-lg')} ref={ref}>
          <div
            className={clsx(
              className,
              'relative rounded-lg px-4 shadow dark:bg-gray-700',
            )}
          >
            {title && (
              <div className="flex items-start justify-between rounded-t border-b border-gunmetal py-5 dark:border-gray-600">
                <h3 className="text-base font-medium">{title}</h3>
                {isClose && (
                  <button onClick={onClose}>
                    <Image
                      src="/x-icon.svg"
                      width={20}
                      height={20}
                      alt="Picture of the author"
                    />
                  </button>
                )}
              </div>
            )}
            <div className="py-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
