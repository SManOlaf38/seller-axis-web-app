import clsx from 'clsx';

interface CardProps extends React.InputHTMLAttributes<{}> {
  className?: string;
  children?: React.ReactNode;
}
export default function Card({ className, children }: CardProps) {
  return <div className={clsx('rounded-lg bg-paperLight dark:bg-darkGreen py-2 px-4 border dark:header_cus header_cus_light', className)}> {children}</div>;
}
