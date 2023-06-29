"use client"

import clsx from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Dropdown } from '@/components/ui/Dropdown'
import { listMenu } from '../../../contants'

const NavOrganization = () => {

  const pathname = usePathname()

  return (
    <div className="bg-darkGreen rounded-lg px-2">
      <div className='flex items-center borer justify-between w-full border-b border-iridium pb-2'>
        <Dropdown
          className="p-2 left-0 w-[250px] mt-1"
          classButton="p-1.5"
          mainMenu={
            <div className="flex gap-2 justify-between w-full">
              <div className="flex items-center">
                <Image
                  src="/userAccount.svg"
                  width={40}
                  height={40}
                  priority
                  alt="Picture of the author"
                />
                <div className='ml-2 flex flex-col items-start'>
                  <p className="text-base font-semibold text-dodgerBlue">Seller Axis</p>
                  <p className="text-sm font-normal text-lightGray">Admin</p>
                </div>
              </div>
              <Image
                src="/down.svg"
                width={15}
                height={15}
                priority
                alt="Picture of the author"
              />
            </div>
          }
        >
          <div>
            <h3 className='px-2'>Organization</h3>
            <div>
              {
                listMenu.map(({ name }) => <div className='flex items-center p-2 w-full' key={name}>
                  <div className='w-full flex items-center'>
                    <Image
                      src="/userAccount.svg"
                      width={15}
                      height={15}
                      priority
                      alt="Picture of the author"
                    />
                    <div className='ml-2'>
                      {name}
                    </div>
                  </div>
                  <Image
                    src="/check.svg"
                    width={15}
                    height={15}
                    priority
                    alt="Picture of the author"
                  />
                </div>)
              }

              <div className='flex items-center p-2 w-full' >
                <Image
                  src="/plus.svg"
                  width={15}
                  height={15}
                  priority
                  alt="Picture of the author"
                />

                <span className='ml-2'> Create Organization</span>
              </div>
            </div>
          </div>
        </Dropdown>
      </div>

      <div className='flex flex-col mt-2'>
        {
          listMenu.map(({ name, url }) => <Link className={clsx('px-2 py-2 inline-block text-sm', {
            ['text-[#ffff] bg-[#333] rounded-md']: pathname === url,
            ['text-[#999]']: pathname !== url
          })} href={url} key={name}>{name}</Link>)
        }
      </div>
    </div >
  )
}

export default NavOrganization