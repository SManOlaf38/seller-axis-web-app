import clsx from 'clsx';

interface IProp extends React.InputHTMLAttributes<{}> {
  className?: string;
  label?: string;
  other?: any;
  error?: string;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  isRequired?: boolean;
}
export default function Input({
  className,
  startIcon,
  endIcon,
  error,
  other,
  label,
  isRequired,
  ...rest
}: IProp) {
  return (
    <>
      {label && (
        <label className="mb-2 block text-sm font-medium">
          {label}{' '}
          {isRequired && <span className="text-sm text-[#DF4F45]">*</span>}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {startIcon}
          </div>
        )}
        <input
          {...rest}
          className={clsx(className, 'w-full rounded-md py-2', {
            'border-[#DF4F45]': error,
          })}
          {...other}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm">
            {endIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mb-2 block text-sm font-medium text-red-800">{error}</p>
      )}
    </>
  );
}
