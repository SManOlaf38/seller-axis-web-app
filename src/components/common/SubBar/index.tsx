import Image from 'next/image';
import React from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import SearchIcon from 'public/search.svg';

type LinkType = {
  name: string;
  url: string;
};

interface IProp {
  title: string;
  addTitle?: string;
  filterContent?: React.ReactNode;
  search?: string;
  isActiveFilter?: boolean;
  typeLayout?: string;
  filterRef?: any;
  onHandleOpen?: () => void;
  onChangeLayout?: (value: string) => void;
  onSearch?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: () => void;
  onSearchModal?: () => void;
  links?: LinkType[];
}

export const SubBar = ({
  search,
  title,
  typeLayout,
  addTitle,
  onSearch,
  onChangeLayout,
  onSearchModal,
  onSubmit,
  links
}: IProp) => {
  const onLayout = (value: string) => () => {
    if (onChangeLayout) onChangeLayout(value);
  };

  return (
    <div className="mb-2 flex w-full items-center justify-between gap-2">
      <div className="flex flex-col justify-center">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="flex items-center">
          {links?.map((item: LinkType, index: number) => {
            return (
              <div key={index} className="flex items-center justify-center text-sm">
                {item.name}
                {links?.length - 1 !== index && (
                  <div className="mx-4 h-1 w-1 rounded-3xl bg-santaGrey" />
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex gap-[8px]">
        <div className="max-sm:hidden md:block">
          <Input
            placeholder="Search..."
            className="border-none pl-9 pr-3"
            value={search}
            onChange={onSearch}
            startIcon={<SearchIcon />}
          />
        </div>
        <div className="max-sm:block sm:hidden">
          <Button className="bg-gunmetal px-3 py-3" onClick={onSearchModal}>
            <SearchIcon />
          </Button>
        </div>

        <Button
          color="bg-primary500"
          className={'flex items-center py-2  max-sm:hidden'}
          onClick={onSubmit}
        >
          <div className="flex items-center gap-2">
            <Image src="/plus.svg" width={15} height={15} alt="Picture of the author" />
            <span className="text-sm text-white">{addTitle}</span>
          </div>
        </Button>
        {onChangeLayout && (
          <>
            <Button
              className={`h-8 px-3 py-3 ${
                typeLayout === 'list' && 'bg-paperLight dark:bg-gunmetal'
              }`}
              onClick={onLayout('list')}
            >
              <Image src="/list-icon.svg" width={14} height={9} alt="Picture of the author" />
            </Button>
            <Button
              className={`h-8 px-3 py-3 ${
                typeLayout === 'grid' && 'bg-paperLight dark:bg-gunmetal'
              }`}
              onClick={onLayout('grid')}
            >
              <Image src="/grid-icon.svg" width={14} height={14} alt="Picture of the author" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
