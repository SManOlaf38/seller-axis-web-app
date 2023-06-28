import React from 'react';
import { DOTS, usePagination } from './usePagination';
import clsx from 'clsx';

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
  isPage,
}: IProp) {
  const paginationRange: (string | number)[] | undefined = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
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

  const lastPage =
    paginationRange && paginationRange[paginationRange.length - 1];

  return (
    <>
      <ul className={`${className} flex items-center justify-center`}>
        <li>
          <button
            type="button"
            disabled={currentPage === 1}
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
              paginationRange.map(
                (pageNumber: number | string, index: number) => {
                  if (pageNumber === DOTS) {
                    return <li key={index}>&#8230;</li>;
                  }
                  return (
                    <li key={index}>
                      <button
                        className={clsx(
                          `rounded-lg px-4 py-2 hover:bg-[#EFF4FF] hover:text-[#4480F7] ${color}`,
                          currentPage === pageNumber &&
                            `bg-[#EFF4FF] text-[#4480F7] ${colorActive}`,
                        )}
                        onClick={() => onPageChange(pageNumber)}
                      >
                        {pageNumber}
                      </button>
                    </li>
                  );
                },
              )
            )}
          </ul>
        </li>

        <li>
          <button
            onClick={onNext}
            disabled={currentPage === lastPage}
            className={`${classButton} flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-center text-sm font-medium text-white`}
          >
            {nextBtn}
          </button>
        </li>
      </ul>
    </>
  );
}
