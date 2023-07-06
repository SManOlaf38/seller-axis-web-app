import clsx from 'clsx';

import LoadingIcon from 'public/loading.svg';

interface IProp extends React.ButtonHTMLAttributes<{}> {
  children: React.ReactNode;
  endIcon?: React.ReactElement;
  startIcon?: React.ReactElement;
  className?: string;
  color?: string;
  isLoading?: boolean;
}
export default function Button(props: IProp) {
  const { isLoading, color, className, children, startIcon, endIcon, ...rest } = props;
  return (
    <button
      {...rest}
      className={clsx(
        color,
        'flex h-8 items-center gap-2 rounded-md px-3 py-2 text-center text-sm font-normal text-white opacity-90',
        className,
        {
          'opacity-70': props.disabled
        }
      )}
    >
      {startIcon && startIcon}
      {isLoading && <LoadingIcon width="14" height="14" />} {children}
      {endIcon && endIcon}
    </button>
  );
}
