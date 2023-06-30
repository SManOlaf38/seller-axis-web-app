'use client';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { listMenuProfile } from '../..';
import { usePathname } from 'next/navigation';

export default function NavProfile() {
  const pathname = usePathname();

  return (
    <div className="rounded-lg bg-darkGreen px-2">
      <div className="borer flex w-full items-center justify-between border-b border-iridium pb-2">
        <div className="flex items-center p-2">
          <Image
            src="/userAccount.svg"
            width={40}
            height={40}
            priority
            alt="Picture of the author"
          />
          <div className="ml-2 flex flex-col items-start">
            <p className="text-base font-semibold text-dodgerBlue">David Lotus</p>
            <p className="text-sm font-normal text-lightGray">david</p>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col">
        {listMenuProfile.map(({ name, url }) => (
          <Link
            className={clsx('inline-block px-2 py-2 text-sm', {
              ['rounded-md bg-[#333] text-[#ffff]']: pathname === url,
              ['text-[#999]']: pathname !== url
            })}
            href={url}
            key={name}
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
}
