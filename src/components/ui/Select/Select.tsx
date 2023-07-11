import clsx from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<{}> {
  className?: string;
  label?: string;
  error?: string;
  options: any[];
}
export default function Select({ className, error, label, options, ...rest }: SelectProps) {
  return (
    <>
      <label className="mb-2 block text-sm font-medium">
        {label}
        {rest.required && <span className="pl-1 text-sm text-red">*</span>}
      </label>
      <select
        {...rest}
        className={clsx(
          'block h-8 w-full rounded-md border-none bg-neutralLight text-sm dark:bg-gunmetal dark:text-white',
          className
        )}
      >
        <option hidden value="default">
          {rest?.value ? rest?.value : 'Select'}
        </option>
        {options.map((item, index) => (
          <option className="text-white" key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>

      {error && <p className="mb-2 block text-sm font-medium text-red">{error}</p>}
    </>
  );
}
