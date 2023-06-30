import clsx from 'clsx';

interface IProp extends React.InputHTMLAttributes<{}> {
  className?: string;
  children?: React.ReactNode;
}
export default function Card({ className, children }: IProp) {
  return <div className={clsx('rounded-lg bg-paperLight dark:bg-darkGreen p-4 border dark:header_cus header_cus_light', className)}> {children}</div>;
}
