import clsx from 'clsx';
import { forwardRef } from 'react';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';

interface TextAreaProp extends React.TextareaHTMLAttributes<{}> {
  className?: string;
  label?: string;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
}

const TextArea = forwardRef(function TextArea(props: TextAreaProp, ref) {
  const { className, startIcon, endIcon, error, label, ...rest } = props;
  return (
    <>
      {label && (
        <label className="mb-2 block text-sm font-medium">
          {label}
          {rest.required && <span className="text-sm text-red-800"> *</span>}
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
          className={clsx(
            className,
            'w-full rounded-md border-none bg-neutralLight px-2 py-2 dark:bg-gunmetal',
            {
              'border-red-800': error
            }
          )}
        />
        {endIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm">{endIcon}</div>
        )}
      </div>
      {error && <p className="mb-2 block text-sm font-medium text-red-800">{error as string}</p>}
    </>
  );
});

export default TextArea;
