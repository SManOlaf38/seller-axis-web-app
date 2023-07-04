import clsx from 'clsx';
import { FieldError, FieldErrorsImpl, Merge } from 'react-hook-form';
import { useState } from 'react';
import type { UseFormRegister, RegisterOptions } from 'react-hook-form';

interface IProp extends React.InputHTMLAttributes<{}> {
  className?: string;
  label?: string;
  other?: any;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  startIcon?: React.ReactElement;
  endIcon?: React.ReactElement;
  isRequired?: boolean;
  register?: UseFormRegister<any>;
  rules?: RegisterOptions;
}
export default function Input({
  className,
  startIcon,
  endIcon,
  error,
  other,
  label,
  isRequired,
  register,
  rules,
  name,
  ...rest
}: IProp) {
  const [openEye, setOpenEye] = useState<boolean>(false);
  const registerResult = register && name ? register(name, rules) : null;

  const toggleEye = () => {
    setOpenEye((prev) => !prev);
  };

  const handleType = () => {
    if (rest.type === 'password') {
      return openEye ? 'text' : 'password';
    }
    return rest.type;
  };

  return (
    <>
      {label && (
        <label className="mb-2 block text-sm font-medium">
          {label}{' '}
          {isRequired && <span className="text-sm text-red-800">*</span>}
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
          className={clsx(className, 'w-full h-8 rounded-md py-1.5 px-2 bg-neutralLight dark:bg-gunmetal text-base border-none', {
            'border-text-red-800': error,
            'dark:text-mistBlue text-lightSecondary': rest.disabled
          })}
          {...other}
          {...registerResult}
          type={handleType()}
        />

        {rest.type === 'password' && openEye && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute right-[5px] top-[10px] h-5 w-5 cursor-pointer"
            onClick={toggleEye}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
        {rest.type === 'password' && !openEye && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute right-[5px] top-[10px] h-5 w-5 cursor-pointer"
            onClick={toggleEye}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
            />
          </svg>
        )}
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
