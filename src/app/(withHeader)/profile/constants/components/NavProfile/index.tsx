'use client';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { listMenuProfile } from '../..';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';

export default function NavProfile() {
  const pathname = usePathname();

  return (
    <Card className="px-[16px] py-[8px]">
      <div className="borer flex w-full items-center border-b border-iridium pb-[23px] pt-[18px]">
        <Image src="/userAccount.svg" width={40} height={40} priority alt="Picture of the author" />
        <div className="ml-[12px] inline-block min-w-[57px] items-start lg:min-w-[145px]">
          <p className="truncate text-left text-base font-semibold text-dodgerBlue">David Lotus</p>
          <p className="truncate text-left text-sm font-normal text-lightGray">david</p>
        </div>
      </div>
      <div className="mt-[16px] flex flex-col">
        {listMenuProfile.map(({ name, url }) => (
          <Link
            className={clsx(
              'text-primary-500 mb-[8px] flex h-[40px] items-center  px-[16px] text-[14px] font-[500] last:mb-0 dark:text-gey100',
              {
                ['rounded-md bg-neutralLight dark:bg-gunmetal']: pathname === url
              }
            )}
            href={url}
            key={name}
          >
            {name}
          </Link>
        ))}
      </div>
    </Card>
  );
}
