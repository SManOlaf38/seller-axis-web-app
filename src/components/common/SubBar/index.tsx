import clsx from 'clsx';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import FilterIcon from 'public/filter.svg';
import GridIcon from 'public/grid-icon.svg';
import ListIcon from 'public/list-icon.svg';
import PlusIcon from 'public/plus-icon.svg';
import SearchIcon from 'public/search.svg';

type LinkType = {
  name: string;
  url: string;
};

interface IProp {
  isSearch?: boolean;
  title?: string;
  addTitle?: string;
  filterContent?: React.ReactNode;
  customHeaderInventory?: React.ReactNode;
  search?: string;
  isActiveFilter?: boolean;
  isDownload?: boolean;
  isLoadingUpdateProductStatic?: boolean;
  typeLayout?: string;
  filterRef?: any;
  onHandleOpen?: () => void;
  handleCancel?: () => void;
  changeQuantity?: any;
  onChangeLayout?: (value: string) => void;
  onSearch?: (e: ChangeEvent<HTMLInputElement>, searchPage: boolean) => void;
  onSubmit?: () => void;
  onSearchModal?: () => void;
  links?: LinkType[];
  otherAction?: React.ReactNode;
}

export const SubBar = ({
  isSearch = true,
  search,
  title,
  typeLayout,
  addTitle,
  isLoadingUpdateProductStatic,
  customHeaderInventory,
  onSearch,
  onChangeLayout,
  onSearchModal,
  onSubmit,
  handleCancel,
  changeQuantity,
  links,
  isActiveFilter,
  isDownload,
  filterContent,
  otherAction
}: IProp) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isToggleFilter, setIsToggleFilter] = useState(false);

  const onLayout = (value: string) => () => {
    if (onChangeLayout) onChangeLayout(value);
  };

  const handleToggleFilter = () => {
    setIsToggleFilter((isToggleFilter) => !isToggleFilter);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsToggleFilter(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

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
        {isSearch && (
          <div className="max-sm:hidden md:block">
            <Input
              placeholder="Search..."
              className="border-none pl-9 pr-3"
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onSearch && onSearch(e, true);
              }}
              startIcon={<SearchIcon />}
            />
          </div>
        )}
        {otherAction && otherAction}

        <div className="max-sm:block sm:hidden">
          <Button className="bg-gunmetal px-3 py-3" onClick={onSearchModal}>
            <SearchIcon />
          </Button>
        </div>
        {customHeaderInventory && customHeaderInventory}
        {addTitle && (
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
        )}

        {onChangeLayout && (
          <>
            <Button
              className={`h-8 px-3 py-3 ${
                typeLayout === 'list' && 'bg-paperLight dark:bg-gunmetal'
              }`}
              onClick={onLayout('list')}
            >
              <ListIcon />
            </Button>
            <Button
              className={`h-8 px-3 py-3 ${
                typeLayout === 'grid' && 'bg-paperLight dark:bg-gunmetal'
              }`}
              onClick={onLayout('grid')}
            >
              <GridIcon />
            </Button>
          </>
        )}

        {isActiveFilter && (
          <div ref={ref} className="relative flex">
            <div
              onClick={handleToggleFilter}
              className="flex cursor-pointer items-center gap-2 rounded-md bg-paperLight px-3 dark:bg-gunmetal"
            >
              <FilterIcon />
              <span className="text-xs">Filter</span>
            </div>

            <div
              className={clsx(
                'absolute right-0 top-full z-10 w-[220px] rounded-lg bg-paperLight p-5 dark:bg-darkGreen',
                {
                  hidden: !isToggleFilter,
                  block: isToggleFilter
                }
              )}
            >
              {filterContent}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
