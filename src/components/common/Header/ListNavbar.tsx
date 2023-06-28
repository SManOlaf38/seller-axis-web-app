import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import { IMenuProp, headerData } from './constant';

export const ListNavbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center">
      {headerData.map((item: IMenuProp, index) => {
        const { name, Icon, path } = item;
        return (
          <Link
            className={clsx(
              'group flex h-full items-center gap-2 border-b px-3 py-2.5 hover:border-b hover:border-dodgerBlue hover:text-dodgerBlue',
              {
                'border-dodgerBlue text-dodgerBlue': pathname.includes(path),
                'border-transparent text-santaGrey': !pathname.includes(path),
              },
            )}
            href={path}
            key={index}
          >
            <Icon
              className={clsx('group-hover:stroke-dodgerBlue', {
                ['stroke-dodgerBlue']: pathname.includes(path),
                ['stroke-santaGrey']: !pathname.includes(path),
              })}
            />
            <h3 className="text-sm font-medium">{name}</h3>
          </Link>
        );
      })}
    </div>
  );
};
