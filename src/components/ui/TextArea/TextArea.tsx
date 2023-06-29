import clsx from 'clsx';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface IProp extends React.TextareaHTMLAttributes<{}> {
  className?: string;
  label?: string;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  isRequired?: boolean;
}
export default function TextArea({
  className,
  startIcon,
  endIcon,
  error,
  label,
  isRequired,
  ...rest
}: IProp) {
  return (
    <>
      {label && (
        <label className="mb-2 block text-sm font-medium">
          {label}
          {isRequired && <span className="text-sm text-red-800">*</span>}
        </label>
      )}
      <div className="relative">
        {startIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {startIcon}
          </div>
        )}
        <textarea
          {...rest}
          className={clsx(className, 'w-full rounded-md py-2 px-2 bg-[#3b3b3b] border-none', {
            'border-red-800': error,
          })}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm">
            {endIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mb-2 block text-sm font-medium text-red-800">{error as string}</p>
      )}
    </>
  );
}
