'use client';
import clsx from 'clsx';

export const InfoOrder = ({
  title,
  value,
  className,
  classNameBorder,
  content,
  subTitle
}: {
  title: string | React.ReactNode;
  subTitle?: string | React.ReactNode;
  value: string | number | React.ReactNode;
  className?: string;
  classNameBorder?: string;
  content?: JSX.Element;
}) => {
  return (
    <div className={clsx('border-b border-lightLine py-1 dark:border-iridium', classNameBorder)}>
      {content}
      <div className={className}>
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">{title}</div>
          {subTitle}
        </div>
        <div className="text-sm font-light">{value}</div>
      </div>
    </div>
  );
};
