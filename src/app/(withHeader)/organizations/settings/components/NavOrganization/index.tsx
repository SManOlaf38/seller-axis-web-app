'use client';

import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Card } from '@/components/ui/Card';
import { Dropdown } from '@/components/ui/Dropdown';
import { listMenu } from '../../../contants';

const NavOrganization = () => {
  const pathname = usePathname();

  return (
    <Card>
      <div className="borer flex w-full items-center justify-between border-b border-iridium py-4">
        <Dropdown
          className="left-0 mt-1 w-[250px] p-2"
          classButton="p-1.5"
          mainMenu={
            <div className="flex w-full justify-between gap-2">
              <div className="flex items-center">
                <Image
                  src="/userAccount.svg"
                  width={40}
                  height={40}
                  priority
                  alt="Picture of the author"
                />
                <div className="ml-2 flex flex-col items-start">
                  <p className="text-base font-semibold text-dodgerBlue">Seller Axis</p>
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

      <div className="mt-2 flex flex-col">
        {listMenu.map(({ name, url }) => (
          <Link
            className={clsx('inline-block px-2 py-2 text-sm', {
              ['rounded-md bg-neutralLight text-primary-500 dark:bg-gunmetal dark:text-paperLight']:
                pathname === url,
              ['text-[#999]']: pathname !== url
            })}
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
