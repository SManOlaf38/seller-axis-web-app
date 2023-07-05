import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

import { Dropdown } from '@/components/ui/Dropdown';
import { IMenuProp, tabletExtra, tabletMain } from './constant';

export const TabletNav = () => {
  const pathname = usePathname();
  const [checkDrop, setCheckDrop] = useState(false);

  const onClick = (value: boolean) => {
    setCheckDrop(value);
  };

  return (
    <div className="flex items-center">
      {tabletMain.map((item: IMenuProp, index) => {
        const { name, Icon, path } = item;
        return (
          <Link
            className={clsx(
              'group flex items-center gap-2 border-b px-3 py-2.5 hover:border-b hover:border-dodgerBlue hover:text-dodgerBlue',
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
      <div className="relative">
        <Dropdown
          onClick={onClick}
          mainMenu={
            <Image
              src="down.svg"
              width={15}
              height={15}
              className={`${checkDrop && 'rotate-180'}`}
              alt="Picture of the author"
              priority
            />
          }
          className="w-[164px] dark:bg-gunmetal"
        >
          <div className="rounded-lg bg-gunmetal">
            {tabletExtra.map((itemNav: IMenuProp, index) => {
              const { name: nameNav, Icon: IconNav, path: pathNav } = itemNav;
              return (
                <Link
                  className={clsx(
                    'group flex items-center gap-2 px-2 py-3 hover:text-dodgerBlue',
                    {
                      ['text-dodgerBlue']: pathname.includes(pathNav),
                      'text-santaGrey': !pathname.includes(pathNav),
                    },
                  )}
                  href={pathNav}
                  key={index}
                >
                  <IconNav
                    className={clsx('group-hover:stroke-dodgerBlue', {
                      ['stroke-dodgerBlue']: pathname.includes(pathNav),
                      'stroke-santaGrey': !pathname.includes(pathNav),
                    })}
                  />
                  <h3 className="text-sm font-medium">{nameNav}</h3>
                </Link>
              );
            })}
          </div>
        </Dropdown>
      </div>
    </div>
  );
};
