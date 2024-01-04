import clsx from 'clsx';
import { useEffect, useRef } from 'react';

import { CheckBox } from '../CheckBox';
import { SortButton } from '../SortButton';

type TypeProp = {
  columns: {
    id: string;
    label: string;
    textAlign?: string;
    dataField?: string;
  }[];
  rows: never[];
  isSelect?: boolean;
  selectAction?: React.ReactElement | null;
  className?: string;
  classHeader?: string;
  itemActive?: number | null;
  selectedItems?: number[];
  loading?: boolean;
  tableRounded?: boolean;
  isBorder?: boolean;
  isHoverRow?: boolean;
  isLoadMore?: boolean;
  disableLodMore?: string | null;
  selectAllTable?: () => void;
  selectItemTable?: (value: number) => void;
  onClickItem?: (value: string | number) => void;
  handleViewMore?: () => Promise<void>;
};

export default function TableScroll({
  isSelect,
  selectedItems,
  classHeader,
  columns,
  selectAction,
  rows = [],
  className,
  loading,
  itemActive,
  isBorder = true,
  tableRounded = true,
  isHoverRow = true,
  isLoadMore,
  disableLodMore,
  selectAllTable,
  selectItemTable,
  onClickItem,
  handleViewMore
}: TypeProp) {
  const ulRef = useRef<HTMLDivElement>(null);

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

  const onScroll = () => {
    if (ulRef.current && !isLoadMore) {
      const { scrollTop, scrollHeight, clientHeight } = ulRef.current;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight;

      if (isNearBottom) {
        handleViewMore && handleViewMore();
      }
    }
  };

  useEffect(() => {
    const listInnerElement = ulRef.current;
    if (listInnerElement && disableLodMore) {
      listInnerElement.addEventListener('scroll', onScroll);
      return () => {
        listInnerElement.removeEventListener('scroll', onScroll);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ulRef.current, disableLodMore, isLoadMore]);

  return (
    <div
      className={clsx('flex flex-col rounded-lg', {
        'custom_header_light dark:header_cus border': isBorder,
        'border-none': !isBorder
      })}
    >
      <div
        className={clsx('inline-block w-full overflow-x-auto align-middle', {
          'rounded-lg': tableRounded,
          '': !tableRounded
        })}
      >
        <div className={clsx(className, 'min-w-full')}>
          <div
            className={clsx(classHeader, 'bg-neutralLight dark:bg-gunmetal', {
              'animate-pulse': loading
            })}
          >
            {loading ? (
              <div className="flex items-center justify-around">
                {isSelect && (
                  <div className="py-3 pl-4">
                    <div className="my-3 h-2 w-10 bg-grey500 dark:bg-gray-500 " />
                  </div>
                )}
                {columns?.map((column: { id: string }) => (
                  <div
                    key={column.id}
                    className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100"
                  >
                    <div className="flex items-center justify-center">
                      <div className="my-2 h-2 w-32 bg-grey500 dark:bg-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-around">
                {isSelect && (
                  <div className="relative px-4 py-2">
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
                  </div>
                )}
                {columns?.map(
                  (column: {
                    id: string;
                    label: string;
                    textAlign?: string;
                    dataField?: string;
                  }) => (
                    <div
                      className="px-4 py-3 text-center text-xs font-semibold capitalize text-lightPrimary dark:text-santaGrey"
                      key={column.id}
                    >
                      <div
                        className={`flex items-center ${
                          column.textAlign ? column?.textAlign : 'justify-center'
                        }`}
                      >
                        {column.label}
                        {column.dataField && <SortButton dataField={column.dataField} />}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
          <div className="overflow-y-auto">
            <div
              ref={ulRef}
              className={clsx(
                `divide-y divide-lightLine bg-paperLight dark:divide-iridium dark:bg-darkGreen ${
                  rows?.length > 0 && 'h-[300px]'
                }`,
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
                        <div key={index} className="flex items-center justify-around">
                          {isSelect && (
                            <div className="flex items-center justify-center py-3 pl-4">
                              <div className="my-3 h-2 w-10 bg-grey500 dark:bg-gray-500 " />
                            </div>
                          )}
                          {columns?.map((column: { id: string }) => (
                            <div
                              key={column.id}
                              className="flex items-center justify-center whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100"
                            >
                              <div className="flex items-center justify-center">
                                <div className="my-2 h-2 w-32 bg-grey500 dark:bg-gray-500" />
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })
                : rows?.map((row: any) => {
                    return (
                      <div
                        className={`flex cursor-pointer items-center justify-around ${
                          itemActive === row.id ? 'bg-neutralLight dark:bg-gunmetal' : ''
                        } ${isHoverRow && 'hover:bg-neutralLight dark:hover:bg-gunmetal'}`}
                        key={row.id}
                      >
                        {isSelect && (
                          <div className="w-[60px] py-3 pl-4">
                            <div className="flex h-5 items-center">
                              <CheckBox
                                checked={selectedItems?.includes(row.id) || false}
                                onChange={handleSelectItemTable(row.id)}
                                className="rounded "
                              />
                            </div>
                          </div>
                        )}
                        {columns?.map((column) => (
                          <div
                            onClick={onHandleClick(row.id)}
                            className={`px-4 py-2 text-sm font-normal text-lightPrimary dark:text-gey100 ${
                              column.textAlign ? column?.textAlign : 'justify-center text-center'
                            }`}
                            key={column.id}
                          >
                            {row[column.id] || '-'}
                          </div>
                        ))}
                      </div>
                    );
                  })}
            </div>
          </div>
          {rows?.length === 0 && !loading && (
            <div className="flex w-full items-center justify-center bg-paperLight py-10 dark:bg-darkGreen">
              No Data
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
