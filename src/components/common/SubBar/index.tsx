import Image from 'next/image';
import React, { useState } from 'react';
import clsx from 'clsx';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import SearchIcon from 'public/search.svg';
import PlusIcon from 'public/plus-icon.svg';
import FilterIcon from 'public/filter.svg';

type LinkType = {
  name: string;
  url: string;
};

interface IProp {
  title?: string;
  addTitle?: string;
  filterContent?: React.ReactNode;
  search?: string;
  isActiveFilter?: boolean;
  typeLayout?: string;
  filterRef?: any;
  onHandleOpen?: () => void;
  handleSaveChanges?: () => void;
  handleCancel?: () => void;
  changeQuantity?: any;
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
  handleSaveChanges,
  handleCancel,
  changeQuantity,
  links,
  isActiveFilter,
  filterContent
}: IProp) => {
  const onLayout = (value: string) => () => {
    if (onChangeLayout) onChangeLayout(value);
  };

  const [isToggleFilter, setIsToggleFilter] = useState(false);

  const handleToggleFilter = () => {
    setIsToggleFilter((isToggleFilter) => !isToggleFilter);
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

        {changeQuantity?.update_quantity || changeQuantity?.next_available_date ? (
          <div className="flex items-center">
            <Button
              color="bg-primary500"
              className={'mr-[8px] flex items-center  py-2 max-sm:hidden'}
              onClick={handleCancel}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">Cancel</span>
              </div>
            </Button>

            <Button
              color="bg-primary500"
              className={'flex items-center py-2  max-sm:hidden'}
              onClick={handleSaveChanges}
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-white">Submit</span>
              </div>
            </Button>
          </div>
        ) : (
          addTitle && (
            <Button
              color="bg-primary500"
              className={'flex items-center py-2  max-sm:hidden'}
              onClick={onSubmit}
            >
              <div className="flex items-center gap-2">
                <PlusIcon />
                <span className="text-sm text-white">{addTitle}</span>
              </div>
            </Button>
          )
        )}

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

        {isActiveFilter && (
          <div className="relative flex">
            <div
              onClick={handleToggleFilter}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-gunmetal px-3"
            >
              <FilterIcon />
              <span className="text-xs">Filter</span>
            </div>

            <div
              className={clsx('absolute right-0 top-full w-[220px] rounded-lg bg-darkGreen p-5', {
                hidden: !isToggleFilter,
                block: isToggleFilter
              })}
            >
              {filterContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
