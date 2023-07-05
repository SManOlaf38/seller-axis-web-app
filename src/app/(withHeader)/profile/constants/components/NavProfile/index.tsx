'use client';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import { listMenuProfile } from '../..';
import { usePathname } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { ContextProfileType } from '../../../context/type';
import { useStoreProfile } from '../../../context';

export default function NavProfile() {
  const { state, dispatch: profileDispatch }: ContextProfileType = useStoreProfile();
  const pathname = usePathname();

  return (
    <Card className="px-[16px] py-[8px]">
      <div className="borer flex w-full items-center border-b border-iridium pb-[23px] pt-[18px]">
        <Image
          src={state?.dataProfile?.avatar ? state?.dataProfile?.avatar : '/userAccount.svg'}
          width={40}
          height={40}
          priority
          alt="Picture of the author"
        />
        <div className="ml-[12px] inline-block min-w-[145px] items-start">
          <p className="truncate text-left text-base font-semibold text-dodgerBlue">
            {state?.dataProfile?.last_name}
          </p>
          <p className="truncate text-left text-sm font-normal text-lightGray">
            {state?.dataProfile?.first_name}
          </p>
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
