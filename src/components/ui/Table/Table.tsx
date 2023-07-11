import clsx from 'clsx';
import Image from 'next/image';

import { CheckBox } from '../CheckBox';
import { Pagination } from '../Pagination';

interface IProp {
  columns: {
    id: string;
    label: string;
    textAlign?: string;
  }[];
  rows: any[];
  isSelect?: boolean;
  selectAction?: React.ReactElement | null;
  className?: string;
  classHeader?: string;
  classPagination?: string;
  siblingCount?: number;
  totalCount?: number;
  isPagination?: boolean;
  selectedItems?: number[];
  currentPage?: number;
  pageSize?: number;
  loading?: boolean;
  selectAllTable?: () => void;
  selectItemTable?: (value: number) => void;
  onClickItem?: (value: string | number) => void;
  onPageChange: (value: string | number) => void;
}

export default function Table({
  isSelect,
  selectedItems,
  classHeader,
  columns,
  selectAction,
  rows = [],
  siblingCount,
  totalCount,
  isPagination,
  className,
  classPagination,
  currentPage,
  pageSize,
  loading,
  onPageChange,
  selectAllTable,
  selectItemTable,
  onClickItem
}: IProp) {
  const handleSelectItemTable = (value: number) => () => {
    if (selectItemTable) {
      selectItemTable(value);
    }
  };
  const onHandleClick = (id: string | number) => () => {
    if (onClickItem) {
      onClickItem(id);
    }
  };

  return (
    <div className="custom_header_light dark:header_cus flex flex-col rounded-lg border">
      <div className="overflow-x-auto ">
        <div className="inline-block w-full align-middle">
          <div className="overflow-hidden rounded-lg">
            <table className={clsx(className, 'min-w-full ')}>
              <thead className={clsx(classHeader, 'bg-neutralLight dark:bg-gunmetal')}>
                <tr>
                  {isSelect && (
                    <th scope="col" className="relative px-4 py-2">
                      <div className="flex h-5 items-center">
                        <CheckBox
                          checked={
                            selectedItems &&
                            selectedItems.length > 0 &&
                            rows.length === selectedItems.length
                          }
                          onChange={selectAllTable}
                          className="rounded"
                        />
                        {selectedItems && selectedItems.length > 0 && (
                          <div className="absolute right-0 flex items-center justify-center">
                            <div className="relative pl-2">{selectAction}</div>
                          </div>
                        )}
                      </div>
                    </th>
                  )}
                  {columns?.map((column: any) => (
                    <th
                      scope="col"
                      className={clsx(
                        'px-6 py-3 text-center text-xs font-semibold capitalize text-lightPrimary dark:text-santaGrey',
                        { 'text-right': column?.textAlign === 'right' },
                        { 'text-left': column?.textAlign === 'left' }
                      )}
                      key={column.id}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={clsx(
                  'divide-y divide-lightLine bg-paperLight dark:divide-iridium dark:bg-darkGreen',
                  {
                    'animate-pulse': loading
                  }
                )}
              >
                {loading
                  ? Array(8)
                      .fill(0)
                      .map((_, index) => {
                        return (
                          <tr key={index}>
                            {isSelect && (
                              <td className="py-3 pl-4">
                                <div className="my-3 h-2 w-10 bg-grey500 dark:bg-gray-500 " />
                              </td>
                            )}
                            {columns?.map((column: any) => (
                              <td
                                key={column.id}
                                className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100"
                              >
                                <div className="flex items-center justify-center">
                                  <div className="my-2 h-2 w-32 bg-grey500 dark:bg-gray-500" />
                                </div>
                              </td>
                            ))}
                          </tr>
                        );
                      })
                  : rows?.map((row: any) => {
                      return (
                        <tr
                          className="cursor-pointer dark:hover:bg-gunmetal hover:bg-neutralLight"
                          key={row.id}
                          onClick={onHandleClick(row.id)}
                        >
                          {isSelect && (
                            <td className="w-[60px] py-3 pl-4">
                              <div className="flex h-5 items-center">
                                <CheckBox
                                  checked={selectedItems?.includes(row.id) || false}
                                  onChange={handleSelectItemTable(row.id)}
                                  className="rounded "
                                />
                              </div>
                            </td>
                          )}
                          {columns?.map((column: any) => (
                            <td
                              className={clsx(
                                'whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100',
                                {
                                  'text-right': column?.textAlign === 'right'
                                },
                                { 'text-left': column?.textAlign === 'left' }
                              )}
                              key={column.id}
                            >
                              {row[column.id] || '-'}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
              </tbody>
            </table>

            {rows?.length === 0 && !loading && (
              <div className="flex w-full items-center justify-center py-10 text-paperLight">
                No Data
              </div>
            )}
          </div>
        </div>
      </div>
      {isPagination ? (
        <div
          className={clsx(
            className,
            'item-centers header_cus flex w-full justify-center rounded-b-lg border-t border-lightLine bg-paperLight py-2 dark:border-iridium dark:bg-darkGreen'
          )}
        >
          <Pagination
            onPageChange={onPageChange}
            totalCount={totalCount || 0}
            siblingCount={siblingCount || 0}
            currentPage={currentPage || 0}
            pageSize={pageSize || 0}
            color="hover:bg-thunder hover:text-dodgerBlue text-mistBlue"
            previousBtn={
              <Image src="/previous-icon.svg" width={20} height={20} alt="Picture of the author" />
            }
            nextBtn={
              <Image src="/next-icon.svg" width={20} height={20} alt="Picture of the author" />
            }
            className={classPagination}
          />
        </div>
      ) : null}
    </div>
  );
}
