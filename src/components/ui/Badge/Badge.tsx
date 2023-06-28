import clsx from 'clsx';

interface IProp {
  className: string;
  title: string;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
}
export default function Badge({ className, title, startIcon, endIcon }: IProp) {
  return (
    <span
      id="badge-dismiss-default"
      className={clsx(
        className,
        'mr-2 inline-flex items-center rounded px-2 py-1 text-sm font-medium',
      )}
    >
      {startIcon && startIcon}
      {title}
      {endIcon && endIcon}
    </span>
  );
}
