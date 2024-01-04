import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import DownIcon from 'public/down.svg';
import { useState } from 'react';
import { Menu, Submenu, headerData } from './constant';

export const ListNavbar = () => {
  const pathname = usePathname();
  const [hover, setHover] = useState('');

  return (
    <div className="flex items-center">
      {headerData.map(({ name, Icon, path, listPath, subMenu }) =>
        subMenu ? (
          <div
            key={name}
            className="group flex h-10 items-center gap-2 px-3 py-2.5 text-santaGrey hover:text-dodgerBlue"
          >
            <div
              onMouseEnter={() => {
                setHover(path);
              }}
              onMouseLeave={() => {
                setHover('');
              }}
              className={clsx('cursor-pointer whitespace-nowrap text-sm font-medium', {
                'border-dodgerBlue text-dodgerBlue': listPath?.includes(pathname),
                'border-transparent text-santaGrey': !listPath?.includes(pathname)
              })}
            >
              <div className="relative flex items-center gap-1">
                <p
                  className={clsx('group-hover:text-dodgerBlue', {
                    'text-dodgerBlue': listPath?.includes(pathname),
                    'text-santaGrey': !listPath?.includes(pathname)
                  })}
                >
                  {name}
                </p>
                <DownIcon
                  className={clsx('group-hover:stroke-dodgerBlue', {
                    'stroke-dodgerBlue': listPath?.includes(pathname),
                    'stroke-santaGrey': !listPath?.includes(pathname)
                  })}
                />
                <div
                  className={clsx('left-0 top-0 z-10 mt-4 w-[164px]', {
                    absolute: hover === path,
                    hidden: hover !== path
                  })}
                >
                  <div className="rounded-lg bg-paperLight dark:bg-darkGreen">
                    {subMenu?.map((itemNav: Submenu, index) => {
                      const { name: nameNav, Icon: IconNav, path: pathNav } = itemNav;
                      return (
                        <Link
                          className={clsx(
                            'my-1 flex items-center gap-2 px-2 py-2 hover:bg-neutralLight hover:dark:bg-gunmetal',
                            {
                              'text-santaGrey': !pathname.includes(pathNav),
                              'bg-neutralLight dark:bg-gunmetal': pathname.includes(pathNav)
                            }
                          )}
                          href={pathNav}
                          key={index}
                        >
                          <IconNav className="stroke-santaGrey" />
                          <h3 className="text-sm font-medium text-santaGrey">{nameNav}</h3>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Link
            key={name}
            href={path}
            className={`group flex h-10 items-center gap-2 border-b border-transparent px-3 py-2.5 text-santaGrey hover:border-b hover:border-dodgerBlue hover:text-dodgerBlue
          ${
            pathname.includes(path)
              ? 'border-dodgerBlue text-dodgerBlue'
              : 'border-transparent text-santaGrey'
          }`}
          >
            <Icon
              className={`group-hover:stroke-dodgerBlue ${
                pathname.includes(path) ? 'stroke-dodgerBlue' : 'stroke-santaGrey'
              }`}
            />
            <h3
              className={`text-sm font-medium ${pathname.includes(path) ? 'text-dodgerBlue' : ''}`}
            >
              {name}
            </h3>
          </Link>
        )
      )}
    </div>
  );
};
