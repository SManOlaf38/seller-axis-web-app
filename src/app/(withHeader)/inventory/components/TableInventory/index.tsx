import { CheckBox } from '@/components/ui/CheckBox';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { getCurrentDate } from '@/utils/utils';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Image from 'next/image';
import { Dispatch, useMemo } from 'react';
import PenIcon from '/public/pencil.svg';
import { Inventory } from '@/app/(withHeader)/interfaces';

interface IProp {
  columns: {
    id: string;
    label: string;
    textAlign?: string;
  }[];
  dataInventory: Inventory[];
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
  changeQuantity?: any;
  selectAllTable?: () => void;
  setChangeQuantity: Dispatch<any>;
  setDataInventory: Dispatch<any>;
  handleToggleLiveQuantity: (value: number) => void;
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
  dataInventory,
  siblingCount,
  totalCount,
  isPagination,
  className,
  classPagination,
  currentPage,
  pageSize,
  loading,
  changeQuantity,
  setChangeQuantity,
  setDataInventory,
  handleToggleLiveQuantity,
  onPageChange,
  selectAllTable,
  selectItemTable,
  onClickItem
}: IProp) {
  const disableAllQuantity = useMemo(() => {
    return dataInventory?.filter((item: Inventory) => !item?.isUseLiveQty);
  }, [dataInventory]);

  const changeEditQuantity = (key: string) => {
    setChangeQuantity({
      ...changeQuantity,
      [key]: !changeQuantity[key]
    });
  };

  const handleChangeUpdateQuantity = (
    name: string,
    event: any,
    indexItem: number,
    indexChildren: number
  ) => {
    setDataInventory((prevTableData: Inventory[]) => {
      const updatedData = prevTableData?.map((item: Inventory, i: number) =>
        i === indexItem
          ? {
              ...item,
              inventory_warehouse: item?.inventory_warehouse?.map(
                (inventory_warehouse: any, j: number) => {
                  if (j === indexChildren) {
                    return {
                      ...inventory_warehouse,
                      [name]:
                        name === 'next_available_date' ? event.target.value : +event.target.value
                    };
                  }
                  return inventory_warehouse;
                }
              )
            }
          : item
      );
      return updatedData;
    });
  };

  const handleSelectItemTable = (value: number) => () => {
    selectItemTable && selectItemTable(value);
  };

  const onHandleClick = (id: string | number) => () => {
    onClickItem && onClickItem(id);
  };

  const handleToggle = (indexItem: number) => {
    handleToggleLiveQuantity && handleToggleLiveQuantity(indexItem);
  };

  return (
    <div className="custom_header_light dark:header_cus flex flex-col rounded-lg border">
      <div className="overflow-x-auto">
        <div className="inline-block w-full align-middle">
          <div className="overflow-x-auto rounded-lg">
            <table className={clsx(className, 'w-full')}>
              <thead className={clsx(classHeader, 'bg-neutralLight dark:bg-gunmetal')}>
                <tr>
                  {isSelect && (
                    <th
                      rowSpan={2}
                      colSpan={1}
                      className="relative border-b border-r border-lightLine px-4 py-2 dark:border-iridium"
                    >
                      <div className="flex h-5 items-center">
                        <CheckBox
                          checked={
                            selectedItems &&
                            selectedItems.length > 0 &&
                            dataInventory.length === selectedItems.length
                          }
                          onChange={selectAllTable}
                          className="rounded"
                        />
                        {selectedItems && selectedItems.length > 0 && (
                          <div className="absolute right-0 flex items-center justify-center">
                            <div className="relative">{selectAction}</div>
                          </div>
                        )}
                      </div>
                    </th>
                  )}
                  <th
                    rowSpan={2}
                    colSpan={1}
                    className="border-b border-r border-lightLine px-[16px] py-[8px] text-center text-xs font-semibold capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey"
                  >
                    Use live inventory
                  </th>
                  {columns?.map((column: any) => (
                    <th
                      rowSpan={column?.id !== 'quantity' && (2 as any)}
                      colSpan={column?.id === 'quantity' && (3 as any)}
                      className={clsx(
                        'border-b border-r border-lightLine px-[16px] py-[8px] text-center text-xs font-semibold capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey',
                        { 'text-right': column?.textAlign === 'right' },
                        { 'text-left': column?.textAlign === 'left' }
                      )}
                      key={column.id}
                    >
                      {(column?.id === 'update_quantity' && disableAllQuantity.length > 0) ||
                      column?.id === 'next_available_date' ? (
                        <div className="flex  items-center">
                          <p className="mr-[8px]">{column.label}</p>
                          <PenIcon
                            fill={'dark:white'}
                            class="cursor-pointer"
                            onClick={() => changeEditQuantity(column.id)}
                          />
                        </div>
                      ) : (
                        <>{column.label}</>
                      )}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="border-b border-r border-lightLine px-[16px] py-[8px] text-center text-xs font-semibold capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey">
                    On hand
                  </th>
                  <th className="border-b border-r border-lightLine px-[16px] py-[8px] text-center text-xs font-semibold capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey">
                    Pending
                  </th>
                  <th className="border-b border-r border-lightLine px-[16px] py-[8px] text-center text-xs font-semibold capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey">
                    Reserved
                  </th>
                </tr>
              </thead>
              <tbody
                className={clsx('divide-y divide-lightLine dark:divide-iridium', {
                  'animate-pulse': loading
                })}
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
                                  <div className="my-2 h-2 w-[55px] bg-grey500 dark:bg-gray-500" />
                                </div>
                              </td>
                            ))}
                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                              <div className="flex items-center justify-center">
                                <div className="my-2 h-2 w-[55px] bg-grey500 dark:bg-gray-500" />
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                              <div className="flex items-center justify-center">
                                <div className="my-2 h-2 w-[55px] bg-grey500 dark:bg-gray-500" />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  : dataInventory?.map((row: Inventory, index: number) => {
                      return (
                        <>
                          <tr key={row.id} onClick={onHandleClick(row.id)}>
                            {isSelect && (
                              <td
                                className="border-r border-lightLine py-3 pl-4 dark:border-iridium"
                                rowSpan={row.inventory_warehouse.length + 1}
                              >
                                <div className="flex h-5 items-center">
                                  <CheckBox
                                    checked={selectedItems?.includes(row.id) || false}
                                    onChange={handleSelectItemTable(row.id)}
                                    className="rounded "
                                  />
                                </div>
                              </td>
                            )}
                            <td
                              className="border-r border-lightLine py-3 pl-4 dark:border-iridium"
                              rowSpan={row.inventory_warehouse.length + 1}
                            >
                              <div className="flex w-[125px] items-center justify-center">
                                <label className="relative inline-flex cursor-pointer items-center">
                                  <input
                                    checked={row?.isUseLiveQty}
                                    onChange={() => handleToggle(index)}
                                    type="checkbox"
                                    name="inventory_enabled"
                                    className="peer sr-only"
                                  />
                                  <div className="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary400 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-800" />
                                </label>
                              </div>
                            </td>
                            <td
                              rowSpan={row.inventory_warehouse.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              {row?.childSKU || '-'}
                            </td>
                            <td
                              rowSpan={row.inventory_warehouse.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              <p className="w-[55px]"> {row?.quantity?.onHand || '-'}</p>
                            </td>
                            <td
                              rowSpan={row.inventory_warehouse.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              {row?.quantity?.pending || '-'}
                            </td>
                            <td
                              rowSpan={row.inventory_warehouse.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              {row?.quantity?.reserved || '-'}
                            </td>
                            <td
                              rowSpan={row.inventory_warehouse.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              {row?.availability || '-'}
                            </td>
                            <td
                              rowSpan={row.inventory_warehouse.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              <p className="w-[80px] truncate">{row?.vendor_sku || '-'}</p>
                            </td>
                            <td
                              rowSpan={row.inventory_warehouse.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              <p className="w-[90px] truncate">{row?.merchant_sku || '-'}</p>
                            </td>
                            <td
                              rowSpan={row.inventory_warehouse.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              <p className="w-[50px] truncate"> {row?.merchantSKU || '-'}</p>
                            </td>
                          </tr>
                          {row?.inventory_warehouse?.map((item: any, indexChildren: number) => (
                            <tr key={indexChildren}>
                              <td
                                scope="row"
                                className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                              >
                                <p className="w-[100px] truncate">
                                  {item?.warehouse_id?.name || '-'}
                                </p>
                              </td>
                              <td
                                scope="row"
                                className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                              >
                                <p className="w-[100px]">{item.current_quantity || '-'}</p>
                              </td>
                              <td
                                scope="row"
                                className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                              >
                                <p className="w-[120px]">
                                  {changeQuantity.update_quantity && !row?.isUseLiveQty ? (
                                    <Input
                                      type="number"
                                      className="flex items-center text-center"
                                      defaultValue={item?.current_quantity}
                                      value={item?.update_quantity}
                                      onChange={(event) =>
                                        handleChangeUpdateQuantity(
                                          'update_quantity',
                                          event,
                                          index,
                                          indexChildren
                                        )
                                      }
                                    />
                                  ) : (
                                    item.current_quantity || '-'
                                  )}
                                </p>
                              </td>
                              <td
                                scope="row"
                                className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                              >
                                <p
                                  className={clsx('w-[100px]', {
                                    'text-primary500': row?.isUseLiveQty
                                  })}
                                >
                                  {item.live_quantity || '-'}
                                </p>
                              </td>
                              <td
                                scope="row"
                                className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                              >
                                <>
                                  {changeQuantity.next_available_date ? (
                                    <input
                                      min={getCurrentDate()}
                                      className="flex h-8 w-[145px] items-center rounded-md border-none bg-neutralLight px-2 py-1.5 text-base dark:bg-gunmetal"
                                      type="date"
                                      value={dayjs(item.next_available_date).format('YYYY-MM-DD')}
                                      onChange={(e) => {
                                        handleChangeUpdateQuantity(
                                          'next_available_date',
                                          e,
                                          index,
                                          indexChildren
                                        );
                                      }}
                                    />
                                  ) : (
                                    <p className="w-[145px]">
                                      {dayjs(item.next_available_date).format('YYYY-MM-DD') || '-'}
                                    </p>
                                  )}
                                </>
                              </td>
                              <td
                                scope="row"
                                className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                              >
                                <p className="w-[140px]">{item.next_available_quantity || '-'}</p>
                              </td>
                            </tr>
                          ))}
                        </>
                      );
                    })}
              </tbody>
            </table>

            {dataInventory?.length === 0 && !loading && (
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
            'item-centers header_cus flex w-full justify-center rounded-b-lg border-t border-lightLine py-2 dark:border-iridium'
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
