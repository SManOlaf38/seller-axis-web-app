import clsx from "clsx";

interface SelectProps extends React.SelectHTMLAttributes<{}> {
  className?: string;
  label?: string;
  error?: string;
  options: any[];
}
export default function Select({ className, error, label, options, ...rest }: SelectProps) {
  return (
    <>
      <label className="mb-2 text-sm font-medium text-white dark:text-white">
        {label}
        {rest.required && <span className="pl-1 text-sm text-red-800">*</span>}

      </label>
      <select {...rest} className={clsx('bg-gunmetal border-none text-white text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:text-white', className)}>
        {
          options.map((item, index) => <option className="text-white" key={index} value={item.value}>{item.label}</option>)
        }
      </select>

      {error && (
        <p className="mb-2 block text-sm font-medium text-red-800">{error}</p>
      )}
    </>
  );
}
