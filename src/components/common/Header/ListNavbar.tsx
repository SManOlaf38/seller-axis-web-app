import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Dropdown } from '@/components/ui/Dropdown';
import { IMenuProp, headerData } from './constant';
import DownIcon from 'public/down.svg';

export const ListNavbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center">
      {headerData.map((item: IMenuProp, index) => {
        const { name, Icon, path } = item;
        return (
          <div
            className={clsx(
              'group flex h-10 items-center border-b border-transparent px-3 py-2.5 text-santaGrey hover:border-b hover:border-dodgerBlue hover:text-dodgerBlue'
            )}
            key={index}
          >
            {item?.subMenu ? (
              <div className="whitespace-nowrap text-sm font-medium">
                {item?.subMenu ? (
                  <div className="flex items-center gap-2">
                    <p>{item.name}</p>
                    <div className="relative">
                      <Dropdown
                        mainMenu={<DownIcon className={clsx('group-hover:stroke-dodgerBlue')} />}
                        className="w-[164px] dark:bg-gunmetal"
                      >
                        <div className="rounded-lg dark:bg-gunmetal bg-paperLight">
                          {item?.subMenu.map((itemNav: any, index) => {
                            const { name: nameNav, Icon: IconNav, path: pathNav } = itemNav;
                            return (
                              <Link
                                className={clsx(
                                  'group flex items-center gap-2 px-2 py-3 hover:text-dodgerBlue',
                                  {
                                    ['text-dodgerBlue']: pathname.includes(pathNav),
                                    'text-santaGrey': !pathname.includes(pathNav)
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
                      </Dropdown>
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
                  className={clsx('group-hover:stroke-dodgerBlue', {
                    ['stroke-dodgerBlue']: pathname.includes(path),
                    ['stroke-santaGrey']: !pathname.includes(path)
                  })}
                />
                <h3 className="text-sm font-medium">{name}</h3>
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
};
