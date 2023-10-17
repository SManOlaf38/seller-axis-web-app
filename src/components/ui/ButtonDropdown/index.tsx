import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import LoadingIcon from 'public/loading.svg';
import IconArrowDown from 'public/down.svg';

interface IProp extends React.ButtonHTMLAttributes<{}> {
  children: React.ReactNode;
  endIcon?: React.ReactElement;
  startIcon?: React.ReactElement;
  className?: string;
  color?: string;
  isLoading?: boolean;
  dropdown: JSX.Element;
}

const ButtonDropdown = (props: IProp) => {
  const { isLoading, color, className, children, startIcon, disabled, endIcon, dropdown, ...rest } =
    props;

  const [isDropdownButton, setIsDropdownButton] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownButton(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div ref={wrapperRef} className="relative flex items-center ">
      <button
        disabled={disabled}
        {...rest}
        className={clsx(
          color,
          'flex h-8 w-[138px] items-center gap-2 rounded-md pl-3 text-center text-sm font-normal text-white opacity-90',
          className,
          {
            'cursor-not-allowed opacity-[.5]': disabled
          }
        )}
      >
        {startIcon && startIcon}
        {isLoading && <LoadingIcon width="14" height="14" />} {children}
        {endIcon && endIcon}
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsDropdownButton((isDropdownButton) => !isDropdownButton);
        }}
        className="absolute right-0 h-8 w-[32px] border-l pl-[8px]"
      >
        <IconArrowDown fill="#dddd" />
      </button>

      <div
        className={clsx(
          'absolute top-full z-10 w-[138px] rounded-lg border border-greenWhite bg-soapstone shadow-lg  dark:border-iridium dark:bg-darkJungle',
          {
            hidden: !isDropdownButton,
            block: isDropdownButton
          }
        )}
      >
        {dropdown}
      </div>
    </div>
  );
};

export default ButtonDropdown;
