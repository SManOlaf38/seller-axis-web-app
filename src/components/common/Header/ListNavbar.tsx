import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import DownIcon from 'public/down.svg';
import { useState } from 'react';
import { Menu, Submenu, headerData } from './constant';

export const ListNavbar = () => {
  const pathname = usePathname();
  const [hover, setHover] = useState(false);

  return (
    <div className="flex items-center">
      {headerData.map((item: Menu, index) => {
        const { name, Icon, path } = item;
        return (
          <div
            className={clsx(
              'group flex h-10 items-center border-b border-transparent px-3 py-2.5 text-santaGrey ',
              {
                'hover:border-b hover:border-dodgerBlue hover:text-dodgerBlue': !item?.subMenu
              }
            )}
            key={index}
          >
            {item?.subMenu ? (
              <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className="cursor-pointer whitespace-nowrap text-sm font-medium"
              >
                {item?.subMenu ? (
                  <div className="relative flex items-center gap-1">
                    <p>{item.name}</p>
                    <DownIcon />
                    <div className="">
                      <div
                        className={clsx('left-0 top-[0px] z-10 mt-4 w-[164px]', {
                          absolute: hover,
                          hidden: !hover
                        })}
                      >
                        <div className="rounded-lg bg-paperLight dark:bg-darkGreen">
                          {item?.subMenu.map((itemNav: Submenu, index) => {
                            const { name: nameNav, Icon: IconNav, path: pathNav } = itemNav;
                            return (
                              <Link
                                className={clsx(
                                  ' my-1 flex items-center gap-2 px-2 py-2 hover:bg-neutralLight hover:dark:bg-gunmetal',
                                  {
                                    'text-santaGrey': !pathname.includes(pathNav),
                                    'bg-neutralLight dark:bg-gunmetal': pathname.includes(pathNav)
                                  }
                                )}
                                href={pathNav}
                                key={index}
                              >
                                <IconNav />
                                <h3 className="text-sm font-medium capitalize">{nameNav}</h3>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link href={path} className="text-sm font-medium">
                    {name}
                  </Link>
                )}
              </div>
            ) : (
              <Link href={path} className="flex items-center gap-2">
                <Icon
                  className={clsx('group-hover:stroke-dodgerBlue ', {
                    ['stroke-dodgerBlue']: pathname.includes(path),
                    ['stroke-santaGrey']: !pathname.includes(path)
                  })}
                />
                <h3
                  className={clsx('text-sm font-medium group-hover:text-dodgerBlue truncate', {
                    'text-dodgerBlue': pathname.includes(path)
                  })}
                >
                  {name}
                </h3>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};
