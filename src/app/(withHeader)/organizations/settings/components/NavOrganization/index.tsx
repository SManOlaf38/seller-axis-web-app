'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Card } from '@/components/ui/Card';
import { Dropdown } from '@/components/ui/Dropdown';
import { listMenu } from '../../../constants';

const NavOrganization = () => {
  const pathname = usePathname();

  return (
    <Card className="px-[16px] py-[8px]">
      <div className="borer flex w-full items-center justify-between border-b border-iridium pt-[18px] pb-[23px]">
        <Dropdown
          className="left-0 mt-1 w-[250px] p-2"
          mainMenu={
            <div className="flex w-full justify-between">
              <div className="flex items-center">
                <Image
                  src="/userAccount.svg"
                  width={40}
                  height={40}
                  priority
                  alt="Picture of the author"
                />
                <div className="ml-[12px] flex flex-col items-start">
                  <p className="text-base font-semibold text-dodgerBlue truncate">Seller Axis</p>
                  <p className="text-sm font-normal text-lightGray">Admin</p>
                </div>
              </div>
              <Image src="/down.svg" width={15} height={15} priority alt="Picture of the author" />
            </div>
          }
        >
          <div>
            <h3 className="px-2">Organization</h3>
            <div>
              {listMenu.map(({ name }) => (
                <div className="flex w-full items-center p-2" key={name}>
                  <div className="flex w-full items-center">
                    <Image
                      src="/userAccount.svg"
                      width={15}
                      height={15}
                      priority
                      alt="Picture of the author"
                    />
                    <div className="ml-2">{name}</div>
                  </div>
                  <Image
                    src="/check.svg"
                    width={15}
                    height={15}
                    priority
                    alt="Picture of the author"
                  />
                </div>
              ))}

              <div className="flex w-full items-center p-2">
                <Image
                  src="/plus.svg"
                  width={15}
                  height={15}
                  priority
                  alt="Picture of the author"
                />

                <span className="ml-2"> Create Organization</span>
              </div>
            </div>
          </div>
        </Dropdown>
      </div>

      <div className="mt-[16px] flex flex-col">
        {listMenu.map(({ name, url }) => (
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
};

export default NavOrganization;
