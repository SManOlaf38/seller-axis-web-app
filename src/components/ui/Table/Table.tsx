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
  onClickItem,
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
    <div className="flex flex-col custom_header_light dark:header_cus rounded-lg border">
      <div className="overflow-x-auto ">
        <div className="inline-block w-full align-middle">
          <div className="overflow-hidden rounded-lg">
            <table
              className={clsx(className, 'min-w-full ')}
            >
              <thead className={clsx(classHeader , 'bg-neutralLight dark:bg-gunmetal')}>
                <tr>
                  {isSelect && (
                    <th scope="col" className="px-4 py-2">
                      <div className="flex h-5 items-center">
                        <CheckBox
                          checked={
                            selectedItems &&
                            selectedItems.length > 0 &&
                            rows.length === selectedItems.length
                          }
                          onChange={selectAllTable}
                          className="rounded bg-darkGreen"
                        />
                        {selectAction}
                      </div>
                    </th>
                  )}
                  {columns?.map((column: any) => (
                    <th
                      scope="col"
                      className={clsx(
                        'px-6 py-3 text-center text-lightPrimary dark:text-santaGrey text-xs font-semibold capitalize',
                        { 'text-right': column?.textAlign === 'right' },
                        { 'text-left': column?.textAlign === 'left' },
                      )}
                      key={column.id}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={clsx('divide-y divide-lightLine dark:divide-iridium', {
                  'animate-pulse': loading,
                })}
              >

                {
                  loading ? Array(10)
                    .fill(0)
                    .map((_, index) => {
                      return (
                        <tr key={index}>
                          {isSelect && (
                            <td className="py-3 pl-4">
                              <div className="my-3 h-2 w-32 bg-gray-500" />
                            </td>
                          )}
                          {columns?.map((column: any) => (
                            <td key={column.id} className="whitespace-nowrap px-4 py-2 text-center text-sm text-lightPrimary dark:text-gey100 font-normal">
                              <div className="flex items-center justify-center">
                                <div className="my-2 h-2 w-32 bg-gray-500 " />
                              </div>
                            </td>
                          ))}
                        </tr>
                      );
                    }) : rows?.map((row: any) => {
                      return (
                        <tr key={row.id} onClick={onHandleClick(row.id)}>
                          {isSelect && (
                            <td className="py-3 pl-4">
                              <div className="flex h-5 items-center">
                                <CheckBox
                                  checked={
                                    selectedItems?.includes(row.id) || false
                                  }
                                  onChange={handleSelectItemTable(row.id)}
                                  className="rounded bg-gunmetal"
                                />
                              </div>
                            </td>
                          )}
                          {columns?.map((column: any) => (
                            <td
                              className={clsx(
                                'whitespace-nowrap px-4 py-2 text-center text-lightPrimary dark:text-gey100 text-sm font-normal',
                                {
                                  'text-right': column?.textAlign === 'right',
                                },
                                { 'text-left': column?.textAlign === 'left' },
                              )}
                              key={column.id}
                            >
                              {row[column.id] || '-'}
                            </td>
                          ))}
                        </tr>
                      )
                    })
                }
              </tbody>
            </table>

            {
              rows?.length === 0 && !loading && (<div className="w-full flex justify-center items-center text-[#fff] py-10">No Data</div>)
            }
          </div>
        </div>
      </div>
      {isPagination ? (
        <div
          className={clsx(
            className,
            'item-centers header_cus flex w-full justify-center rounded-b-lg border-t py-2',
          )}
        >
          <Pagination
            onPageChange={onPageChange}
            totalCount={totalCount || 0}
            siblingCount={siblingCount || 0}
            currentPage={currentPage || 0}
            pageSize={pageSize || 0}
            colorActive="bg-thunder !text-dodgerBlue"
            color="hover:bg-thunder hover:text-dodgerBlue text-mistBlue"
            previousBtn={
              <Image
                src="/previous-icon.svg"
                width={20}
                height={20}
                alt="Picture of the author"
              />
            }
            nextBtn={
              <Image
                src="/next-icon.svg"
                width={20}
                height={20}
                alt="Picture of the author"
              />
            }
            className={classPagination}
          />
        </div>
      ) : null}
    </div>
  );
}