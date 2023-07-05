'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import { listMenu } from '@/app/(withHeader)/organizations/constants';
import { Card } from '@/components/ui/Card';
import { Dropdown } from '@/components/ui/Dropdown';

const NavOrganization = () => {
  const pathname = usePathname();
  const params = useParams();

  return (
    <Card className="px-[16px] py-[8px]">
      <div className="borer flex w-full items-center justify-between border-b border-iridium pb-[23px] pt-[18px]">
        <Dropdown
          className="left-0 mt-1 w-[250px] p-2 dark:bg-gunmetal"
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
                <div className="ml-[12px] inline-block max-w-[45px] items-start lg:min-w-[145px]">
                  <p className="truncate text-left text-base font-semibold text-dodgerBlue">
                    Seller AxisSeller
                  </p>
                  <p className="truncate text-left text-sm font-normal text-lightGray">Admin</p>
                </div>
              </div>
              <Image src="/down.svg" width={15} height={15} priority alt="Picture of the author" />
            </div>
          }
        >
          <div>
            <h3 className="px-2">Organization</h3>
            <div>
              {listMenu(params.id).map(({ name }) => (
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
        {listMenu(params.id).map(({ name, url }) => (
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
