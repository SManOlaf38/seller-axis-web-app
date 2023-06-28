import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { IMenuProp, headerData } from './constant';

export const MobileNav = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col">
      <div>
        <Input
          startIcon={
            <Image
              src="/search.svg"
              width={20}
              height={20}
              alt="Picture of the author"
            />
          }
          className="border-none pl-9 pr-3"
          placeholder="Search in all system..."
        />
      </div>
      <div>
        {headerData.map((item: IMenuProp, index) => {
          const { name, Icon, path } = item;
          return (
            <Link
              className={clsx(
                'group flex items-center gap-2  px-3 py-2.5 hover:text-dodgerBlue',
                {
                  ['text-dodgerBlue']: pathname.includes(path),
                  ['text-santaGrey']: !pathname.includes(path),
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
      <div>
        <Button className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/userAccount.svg"
              width={20}
              height={20}
              alt="Picture of the author"
            />
            <h3 className="text-sm font-medium">David Lotus</h3>
          </div>
          <Image
            src="/down.svg"
            width={20}
            height={20}
            alt="Picture of the author"
          />
        </Button>
      </div>
    </div>
  );
};
