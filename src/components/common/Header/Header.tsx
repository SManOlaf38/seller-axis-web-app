'use client';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Switch } from '@/components/ui/Switch';
import { Theme } from '@/utils/theme';
import { useStore } from '@/app/(withHeader)/organizations/context';
import * as action from '@/app/(withHeader)/organizations/context/action';
import * as service from '@/app/(withHeader)/organizations/fetch';
import SearchIcon from 'public/search.svg';
import { ListNavbar } from './ListNavbar';
import { MobileNav } from './MobileNav';
import { TabletNav } from './TabletNav';

import './globals.css';

export const Logo = () => {
  return (
    <div className="flex items-center">
      <Image src="/hamburger.svg" alt={'hamburger'} width={16} height={16} />
      <Link href="/" className="ml-2 font-semibold text-dodgerBlue">
        Seller Axis
      </Link>
    </div>
  );
};

export function Header({ currentTheme }: { currentTheme: Theme }) {
  const {
    state: { isLoading },
    dispatch
  } = useStore();
  const router = useRouter();

  const [isShow, setIsShow] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [theme, setTheme] = useState<Theme>(currentTheme);

  const ref = useRef<HTMLDivElement>(null);

  const onShowMobile = () => {
    setIsShow(!isShow);
  };

  const onSearchModal = () => {
    setSearchModal(!searchModal);
  };

  const handleToggle = () => {
    const root = document.getElementsByTagName('html')[0];
    root.classList.toggle(Theme.dark);
    if (root.classList.contains(Theme.dark)) {
      setTheme(Theme.dark);
      document.cookie = `theme=${Theme.dark}`;
    } else {
      setTheme(Theme.light);
      document.cookie = `theme=${Theme.light}`;
    }
    setIsChecked((isChecked) => !isChecked);
  };

  const getOrganizations = useCallback(async () => {
    try {
      dispatch(action.getOrganizationRequest());
      const data = await service.getOrganizationsService();
      dispatch(action.getOrganizationSuccess(data));
      if (data.results.length === 0) {
        Cookies.remove('current_organizations');
        router.push('/create-organization');
      }

      const idOrganizations = Cookies.get('current_organizations');
      if (data.results[0]?.id && !idOrganizations) {
        Cookies.set('current_organizations', data.results[0]?.id);
      }
    } catch (error: any) {
      dispatch(action.getOrganizationFail(error.detail));
    }
  }, [dispatch, router]);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        if (isShow) {
          setIsShow(!isShow);
        }
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isShow, ref]);

  useEffect(() => {
    getOrganizations();
  }, [getOrganizations]);

  return (
    <aside className="w-full">
      <nav className="custom_header_light dark:header_cus h-10 my-3 flex items-center justify-between gap-2.5 rounded-lg border bg-paperLight px-3 dark:bg-darkGreen">
        <div className="flex gap-5">
          <Logo />
          <div className="max-[1148px]:hidden">
            <ListNavbar />
          </div>
          <div className="max-[1148px]:block max-[680px]:hidden min-[1148px]:hidden">
            <TabletNav />
          </div>
        </div>
        <div className="flex items-center justify-between max-[680px]:hidden">
          <div>
            <Button className="px-2.5 py-2.5" onClick={onSearchModal}>
              <SearchIcon />
            </Button>
          </div>
          <div className="inline-block h-[28px] min-h-[1em] w-0.5 bg-iridium opacity-100" />
          <div className="flex items-center">
            <Button className="px-2.5 py-2.5">
              <Image
                src="/notification.svg"
                width={20}
                height={20}
                priority
                alt="Picture of the author"
              />
            </Button>
            <Switch isChecked={isChecked} onToggle={handleToggle} />

            <div className="relative">
              <Dropdown
                className="mt-4 w-[164px] p-2"
                classButton="p-1.5"
                mainMenu={
                  <div className="flex gap-2">
                    <Image
                      src="/userAccount.svg"
                      width={20}
                      height={20}
                      priority
                      alt="Picture of the author"
                    />
                    <p>David Lotus</p>
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
                <Link href={'/profile'} className="item flex items-center">
                  <Image
                    src="/default-avatar.svg"
                    width={20}
                    height={20}
                    priority
                    alt="Picture of the author"
                  />
                  <span className="ml-[12px]">Profile</span>
                </Link>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="items-center p-1 max-[680px]:flex min-[680px]:hidden" ref={ref}>
          <Button className="px-2 py-1.5">
            <Image src="/notification.svg" width={20} height={20} alt="Picture of the author" />
          </Button>
          <div className="inline-block h-[18px] min-h-[1em] w-[1px] bg-iridium opacity-100" />
          <div>
            <Button
              className="px-2.5 py-1.5 max-[680px]:block min-[680px]:hidden"
              onClick={onShowMobile}
            >
              <Image
                src={`/${isShow ? 'close-icon' : 'list'}.svg`}
                width={20}
                height={20}
                alt="Picture of the author"
              />
            </Button>
            <div
              className={clsx(
                'absolute right-0 z-10 mt-3 w-full origin-top-right rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
                { block: isShow, hidden: !isShow }
              )}
            >
              <div className="mx-4 rounded-lg bg-darkGreen p-3">
                <MobileNav />
              </div>
            </div>
          </div>
        </div>
        <Modal open={searchModal} onClose={onSearchModal}>
          <div>
            <Input
              placeholder="Search in all system..."
              className="border-none py-2 pl-[50px] pr-3"
              startIcon={
                <SearchIcon />
              }
            />
          </div>
        </Modal>
      </nav>
    </aside>
  );
}
