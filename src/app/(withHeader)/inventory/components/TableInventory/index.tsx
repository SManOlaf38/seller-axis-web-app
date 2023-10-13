import { CheckBox } from '@/components/ui/CheckBox';
import { Input } from '@/components/ui/Input';
import { Pagination } from '@/components/ui/Pagination';
import { getCurrentDate } from '@/utils/utils';
import clsx from 'clsx';
import dayjs from 'dayjs';
import Image from 'next/image';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';
import PenIcon from '/public/pencil.svg';
import { ProductAlias } from '../../interface';
import { useRouter } from 'next/navigation';
import { SortButton } from '@/components/ui/SortButton';

interface IProp {
  columns: {
    id: string;
    label: string;
    textAlign?: string;
    dataField?: string;
  }[];
  dataInventory: ProductAlias[];
  isSelect?: boolean;
  selectAction?: React.ReactElement | null;
  className?: string;
  classHeader?: string;
  classPagination?: string;
  siblingCount?: number;
  totalCount?: number;
  isPagination?: boolean;
  selectedItems?: number[];
  currentPage: number;
  pageSize?: number;
  loading?: boolean;
  changeQuantity?: any;
  changedIdsQuantity: number[];
  setChangedIdsQuantity: Dispatch<SetStateAction<number[]>>;
  selectAllTable?: () => void;
  setChangeQuantity: Dispatch<any>;
  setDataInventory: Dispatch<any>;
  handleToggleLiveQuantity: (value: number) => void;
  selectItemTable?: (value: number) => void;
  onClickItem?: (value: string | number) => void;
  onPageChange: (value: string | number) => void;
  onChangePerPage: (e: ChangeEvent<HTMLSelectElement>) => void;
  onSort: (column: string, isAsc: boolean) => void;
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
  changedIdsQuantity,
  setChangedIdsQuantity,
  setChangeQuantity,
  setDataInventory,
  handleToggleLiveQuantity,
  onPageChange,
  selectAllTable,
  selectItemTable,
  onClickItem,
  onChangePerPage,
  onSort,
}: IProp) {
  const [sortingColumn, setSortingColumn] = useState<string | null>(null);
  const [ascStates, setAscStates] = useState<{[key: string]: boolean}>({});

  const router = useRouter();
  const disableAllQuantity = useMemo(() => {
    return dataInventory?.filter((item: ProductAlias) => !item?.is_live_data);
  }, [dataInventory]);

  useEffect(() => {
    setAscStates(columns.reduce((result: {[key: string]: boolean}, column) => column.dataField ? {...result, [column.dataField]: false} : result, {}));
  }, [columns])

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
    setDataInventory((prevTableData: ProductAlias[]) => {
      const updatedData = prevTableData?.map((item: ProductAlias, i: number) =>
        i === indexItem
          ? {
              ...item,
              retailer_warehouse_products: item?.retailer_warehouse_products?.map(
                (inventory_warehouse: any, j: number) => {
                  if (j === indexChildren) {
                    return {
                      ...inventory_warehouse,
                      product_warehouse_statices: {
                        ...inventory_warehouse.product_warehouse_statices,
                        [name]:
                          name === 'next_available_date' ? event.target.value : +event.target.value
                      }
                    };
                  }
                  return inventory_warehouse;
                }
              )
            }
          : item
      );
      const changedId = updatedData[indexItem]?.id;
      if (changedId && !changedIdsQuantity.includes(+changedId)) {
        setChangedIdsQuantity((prevIds) => [...prevIds, changedId] as never);
      }
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

  const handleChangePageProductAlias = (id: number | string) => {
    router.push(`/product-aliases/${id}`);
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
                    className="border-b border-r border-lightLine px-[16px] py-[8px] text-center text-[11px] font-semibold capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey"
                  >
                    Use live inventory
                  </th>
                  {columns?.map((column: any) => (
                    <th
                      rowSpan={column?.id !== 'quantity' && (2 as any)}
                      colSpan={column?.id === 'quantity' && (3 as any)}
                      className={clsx(
                        'text-centerfont-semibold border-b border-r border-lightLine px-[16px] py-[8px] capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey',
                        { 'text-right': column?.textAlign === 'right' },
                        { 'text-left': column?.textAlign === 'left' }
                      )}
                      key={column.id}
                    >
                      {(column?.id === 'update_quantity' && disableAllQuantity?.length > 0) ||
                      column?.id === 'next_available_date' ||
                      column?.id === 'next_available_qty' ? (
                        <div className="flex items-center justify-center text-[11px]">
                          <p className="flex w-[80px] items-center justify-center">
                            {column.label}
                            {onSort && column.dataField && <SortButton
                              dataField={column.dataField}
                              onSort={() => {
                                setSortingColumn(column.dataField);
                                setAscStates({...ascStates, [column.dataField]: !ascStates[column.dataField]});
                                onSort(column.dataField, ascStates[column.dataField]);
                              }}
                              isAsc={ascStates[column.dataField]}
                              isActive={sortingColumn == column.dataField}
                            />}
                          </p>
                          <PenIcon
                            fill={'dark:white'}
                            class="cursor-pointer"
                            onClick={() => changeEditQuantity(column.id)}
                          />
                        </div>
                      ) : (
                        <p className="text-[11px] flex items-center justify-center">
                          {column.label}
                          {onSort && column.dataField && <SortButton
                            dataField={column.dataField}
                            onSort={() => {
                              setSortingColumn(column.dataField);
                              setAscStates({...ascStates, [column.dataField]: !ascStates[column.dataField]});
                              onSort(column.dataField, ascStates[column.dataField]);
                            }}
                            isAsc={ascStates[column.dataField]}
                            isActive={sortingColumn == column.dataField}
                          />}
                        </p>
                      )}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th className="border-b border-r border-lightLine px-[16px] py-[8px] text-center text-[11px] font-semibold capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey">
                    On hand
                  </th>
                  <th className="border-b border-r border-lightLine px-[16px] py-[8px] text-center text-[11px] font-semibold capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey">
                    Pending
                  </th>
                  <th className="border-b border-r border-lightLine px-[16px] py-[8px] text-center text-[11px] font-semibold capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey">
                    Reserved
                  </th>
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
                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                              <div className="flex items-center justify-center">
                                <div className="my-2 h-2 w-[55px] bg-grey500 dark:bg-gray-500" />
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  : dataInventory?.map((row: ProductAlias, index: number) => {
                      return (
                        <>
                          <tr key={row.id} onClick={onHandleClick(row.id)}>
                            {isSelect && (
                              <td
                                className="border-r border-lightLine py-3 pl-4 dark:border-iridium"
                                rowSpan={row?.retailer_warehouse_products?.length + 1}
                              >
                                <div className="flex h-5 items-center">
                                  <CheckBox
                                    checked={selectedItems?.includes(+row.id) || false}
                                    onChange={handleSelectItemTable(+row.id)}
                                    className="rounded "
                                  />
                                </div>
                              </td>
                            )}
                            <td
                              className="border-r border-lightLine py-3 pl-4 dark:border-iridium"
                              rowSpan={row?.retailer_warehouse_products?.length + 1}
                            >
                              <div className="flex items-center justify-center">
                                <label className="relative inline-flex cursor-pointer items-center">
                                  <input
                                    checked={row?.is_live_data}
                                    onChange={() => handleToggle(index)}
                                    type="checkbox"
                                    name="inventory_enabled"
                                    className="peer sr-only"
                                  />
                                  <div className="h-4 w-8 rounded-full bg-gray-200 after:absolute after:left-[1.5px] after:top-[0.5px] after:h-[15px] after:w-[15px] after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary400 peer-checked:after:translate-x-full peer-checked:after:border-white dark:border-gray-600 dark:bg-gray-800" />
                                </label>
                              </div>
                            </td>
                            <td
                              rowSpan={row?.retailer_warehouse_products?.length + 1}
                              className="cursor-pointer whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary underline dark:border-iridium dark:text-gey100"
                            >
                              <div onClick={() => handleChangePageProductAlias(row?.id)}>
                                {row?.sku || '-'}
                              </div>
                            </td>
                            <td
                              rowSpan={row?.retailer_warehouse_products?.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              {row?.product?.qty_on_hand || '-'}
                            </td>
                            <td
                              rowSpan={row?.retailer_warehouse_products?.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              {row?.product?.qty_pending || '-'}
                            </td>
                            <td
                              rowSpan={row?.retailer_warehouse_products?.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              {row?.product?.qty_reserve || '-'}
                            </td>
                            <td
                              rowSpan={row?.retailer_warehouse_products?.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              {row?.product?.available || '-'}
                            </td>
                            <td
                              rowSpan={row?.retailer_warehouse_products?.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              <p>{row?.vendor_sku || '-'}</p>
                            </td>
                            <td
                              rowSpan={row?.retailer_warehouse_products?.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              <p>{row?.merchant_sku || '-'}</p>
                            </td>
                            <td
                              rowSpan={row?.retailer_warehouse_products?.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                            >
                              <p>{row?.retailer?.name || '-'}</p>
                            </td>
                            {row?.retailer_warehouse_products.length === 0 && (
                              <>
                                <td
                                  rowSpan={row?.retailer_warehouse_products?.length + 1}
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  -
                                </td>
                                <td
                                  rowSpan={row?.retailer_warehouse_products?.length + 1}
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  -
                                </td>
                                <td
                                  rowSpan={row?.retailer_warehouse_products?.length + 1}
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  -
                                </td>
                                <td
                                  rowSpan={row?.retailer_warehouse_products?.length + 1}
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  -
                                </td>
                                <td
                                  rowSpan={row?.retailer_warehouse_products?.length + 1}
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  -
                                </td>
                                <td
                                  rowSpan={row?.retailer_warehouse_products?.length + 1}
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  -
                                </td>
                              </>
                            )}
                          </tr>
                          {row?.retailer_warehouse_products?.map(
                            (item: any, indexChildren: number) => (
                              <tr key={indexChildren}>
                                <td
                                  scope="row"
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  <p>{item?.retailer_warehouse?.name || '-'}</p>
                                </td>
                                <td
                                  scope="row"
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  <p>{item?.product_warehouse_statices?.qty_on_hand || '-'}</p>
                                </td>
                                <td
                                  scope="row"
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  <div className="flex w-full items-center justify-center text-center">
                                    {changeQuantity.update_quantity && !row?.is_live_data ? (
                                      <Input
                                        type="number"
                                        className="flex h-[30px] w-[74px] items-center text-center"
                                        defaultValue={item?.product_warehouse_statices?.qty_on_hand}
                                        value={item?.product_warehouse_statices?.update_quantity}
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
                                      item?.product_warehouse_statices?.qty_on_hand || '-'
                                    )}
                                  </div>
                                </td>
                                <td
                                  scope="row"
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  <p
                                    className={clsx('', {
                                      'text-primary500': row?.is_live_data
                                    })}
                                  >
                                    {item?.live_data_packages} pks & {item?.live_data_pieces} pcs
                                  </p>
                                </td>
                                <td
                                  scope="row"
                                  className="h-[48px] whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  <p className="m-auto w-[120px]">
                                    {changeQuantity.next_available_date ? (
                                      <input
                                        min={getCurrentDate()}
                                        className="flex h-[30px] w-[120px] items-center justify-center rounded-md border-none bg-neutralLight px-2 py-[6px] text-[14px] dark:bg-gunmetal"
                                        type="date"
                                        value={dayjs(
                                          item?.product_warehouse_statices?.next_available_date
                                        ).format('YYYY-MM-DD')}
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
                                      <>
                                        {item?.product_warehouse_statices?.next_available_date
                                          ? dayjs(
                                              item?.product_warehouse_statices?.next_available_date
                                            ).format('MM/DD/YYYY')
                                          : '-'}
                                      </>
                                    )}
                                  </p>
                                </td>
                                <td
                                  scope="row"
                                  className="h-[48px] whitespace-nowrap border-r border-lightLine px-4 py-1 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  <p className="m-auto w-[100px]">
                                    {changeQuantity.next_available_qty ? (
                                      <Input
                                        type="number"
                                        className="flex h-[32px] items-center py-[6px] text-center"
                                        value={item?.product_warehouse_statices?.next_available_qty}
                                        onChange={(event) =>
                                          handleChangeUpdateQuantity(
                                            'next_available_qty',
                                            event,
                                            index,
                                            indexChildren
                                          )
                                        }
                                      />
                                    ) : (
                                      <>
                                        {item?.product_warehouse_statices?.next_available_qty ||
                                          '-'}
                                      </>
                                    )}
                                  </p>
                                </td>
                              </tr>
                            )
                          )}
                        </>
                      );
                    })}
              </tbody>
            </table>

            {dataInventory?.length === 0 && !loading && (
              <div className="flex w-full items-center justify-center bg-paperLight py-10 dark:bg-darkGreen">
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
            onChangePerPage={onChangePerPage}
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
