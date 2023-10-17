import React, { ChangeEvent } from 'react';
import { DOTS, usePagination } from './usePagination';
import clsx from 'clsx';
import { Select } from '../Select';
import { optionsPerPage } from '@/constants';

interface IProp {
  onPageChange: (value: number | string) => void;
  totalCount: number;
  siblingCount: number;
  currentPage: number;
  pageSize: number;
  className?: string;
  color?: string;
  previousBtn?: string | React.ReactElement;
  nextBtn?: string | React.ReactElement;
  classButton?: string;
  isPage?: boolean;
  colorActive?: string;
  onChangePerPage?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function Pagination({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className,
  previousBtn,
  color,
  nextBtn,
  classButton,
  colorActive,
  onChangePerPage,
  isPage
}: IProp) {
  const paginationRange: (string | number)[] | undefined = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  // if (currentPage === 0 || (paginationRange && paginationRange.length < 2)) {
  //   return null;
  // }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange && paginationRange[paginationRange.length - 1];

  return (
    <div className="relative w-full">
      <ul className={`${className} flex items-center justify-center`}>
        <li>
          <button
            type="button"
            disabled={currentPage === 1 || pageSize === -1}
            onClick={onPrevious}
            className={`${classButton} flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-center text-sm font-medium text-white`}
          >
            {previousBtn}
          </button>
        </li>
        <li>
          <ul className="flex">
            {isPage ? (
              <p>
                Page {currentPage} of {lastPage}
              </p>
            ) : (
              paginationRange &&
              paginationRange.map((pageNumber: number | string, index: number) => {
                if (pageNumber === DOTS) {
                  return <li key={index}>&#8230;</li>;
                }
                return (
                  <li key={index}>
                    <button
                      className={clsx(
                        `rounded-lg px-4 py-2 hover:bg-[#EFF4FF] hover:text-[#4480F7] ${color}`,
                        currentPage === pageNumber &&
                          'bg-primary100 text-primary500 dark:bg-thunder'
                      )}
                      onClick={() => onPageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </li>

        <li>
          <button
            onClick={onNext}
            disabled={currentPage === lastPage || pageSize === -1}
            className={`${classButton} flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-center text-sm font-medium text-white`}
          >
            {nextBtn}
          </button>
        </li>
      </ul>
      <div className="absolute bottom-1 right-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-normal">Rows per page:</p>
          <Select
            className="!w-[75px]"
            options={optionsPerPage}
            value={pageSize}
            onChange={onChangePerPage}
          />
        </div>
      </div>
    </div>
  );
}
