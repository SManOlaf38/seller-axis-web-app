import Image from 'next/image';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import IconAction from 'public/three-dots.svg';
import DownloadIcon from 'public/download.svg';

import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Pagination } from '@/components/ui/Pagination';
import { CheckBox } from '@/components/ui/CheckBox';

import { DivideIntoPack, HeaderTable, OrderItems } from '../../interfaces';

type TableDailyPickList = {
  headerTable: any;
  selectedItems: number[];
  totalCount: number;
  page: number;
  rowsPerPage: number;
  loading?: boolean;
  dataDaily: any;
  onSelectAll: () => void;
  onSelectItem: (id: number) => void;
  onPageChange: (value: string | number) => void;
};

export const TableDailyPickList = (props: TableDailyPickList) => {
  const {
    headerTable,
    selectedItems,
    totalCount,
    page,
    rowsPerPage,
    loading,
    dataDaily,
    onPageChange,
    onSelectAll,
    onSelectItem
  } = props;
  const itemSelected = useMemo(() => {
    return dataDaily?.filter((item: any) => selectedItems?.includes(item.id));
  }, [dataDaily, selectedItems]);

  const printHeader = useMemo(() => {
    return headerTable?.map((item: HeaderTable) => item.label);
  }, [headerTable]);

  const [isHover, setIsHover] = useState<any>({});

  const handleSelectItemTable = (value: number) => () => {
    onSelectItem && onSelectItem(value);
  };

  const handlePrintItemSelected = () => {
    const doc = new jsPDF();
    const processedData = [] as any;
    itemSelected.forEach((row: any) => {
      if (row?.divide_into_pack?.length > 0) {
        processedData.push([row.master_sku, row.sku_total]);
        row?.divide_into_pack?.forEach((item: DivideIntoPack) => {
          processedData.push([
            { content: '' },
            { content: '' },
            item.size || '-',
            item.number || '-'
          ]);
        });
      } else {
        processedData.push([{ content: row.master_sku || '-' }, { content: row.sku_total || '-' }]);
      }
    });
    autoTable(doc, {
      theme: 'grid',
      head: [printHeader],
      body: processedData
    });
    doc.save('Daily_Pick_List.pdf');
  };

  return (
    <div className="custom_header_light dark:header_cus flex flex-col rounded-lg border">
      <div className="overflow-x-auto ">
        <div className="inline-block w-full align-middle">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead className="bg-neutralLight dark:bg-gunmetal">
                <tr>
                  <th className="relative w-[60px] border-b border-r border-lightLine px-4 py-2 dark:border-iridium">
                    <div className="flex h-5 items-center justify-center">
                      <CheckBox
                        checked={
                          selectedItems &&
                          selectedItems.length > 0 &&
                          dataDaily.length === selectedItems.length
                        }
                        onChange={onSelectAll}
                        className="rounded"
                      />
                      {selectedItems && selectedItems.length > 0 && (
                        <div className="absolute right-0 flex items-center justify-center">
                          <div className="relative">
                            <Dropdown
                              className="left-0 w-[160px] dark:bg-gunmetal"
                              mainMenu={<IconAction />}
                            >
                              <div className="rounded-lg">
                                <Button onClick={handlePrintItemSelected}>
                                  <DownloadIcon />
                                  <span className="items-start text-lightPrimary dark:text-santaGrey">
                                    Download
                                  </span>
                                </Button>
                              </div>
                            </Dropdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </th>
                  {headerTable?.map((column: any, index: number) => (
                    <th
                      key={index}
                      className="border-b border-r border-lightLine px-[16px] py-[8px] text-center text-[11px] font-semibold capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey"
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
                            <td className="px-4 py-3">
                              <div className="my-3 h-2 w-10 bg-grey500 dark:bg-gray-500 " />
                            </td>
                            {headerTable?.map((column: any) => (
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
                  : dataDaily?.map((row: any, index: number) => {
                      return (
                        <>
                          <tr key={index}>
                            <td
                              className="w-[60px] border-r border-lightLine px-4 py-3 dark:border-iridium"
                              rowSpan={row?.divide_into_pack?.length + 1}
                            >
                              <div className="flex h-5 items-center justify-center">
                                <CheckBox
                                  checked={selectedItems?.includes(row.id) || false}
                                  onChange={handleSelectItemTable(row.id)}
                                  className="rounded "
                                />
                              </div>
                            </td>

                            <td
                              rowSpan={row?.divide_into_pack?.length + 1}
                              className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal dark:border-iridium dark:text-gey100"
                            >
                              <span className="truncate">{row.master_sku || '-'}</span>
                            </td>
                            <td
                              onMouseOver={() => {
                                setIsHover({
                                  ...row
                                });
                              }}
                              onMouseLeave={() => {
                                setIsHover({});
                              }}
                              rowSpan={row?.divide_into_pack?.length + 1}
                              className="cursor-pointer whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal dark:border-iridium dark:text-gey100"
                            >
                              <span className="truncate">{row.sku_total || '-'}</span>
                              {isHover.id === row.id && (
                                <div className="dark:header_cus header_cus_light absolute z-20 inline cursor-default rounded-lg border border-lightLine bg-paperLight px-4 py-2 shadow-lg ring-1 ring-black ring-opacity-5 transition-transform duration-100 ease-in dark:border-iridium dark:bg-darkGreen">
                                  <span className="font-bold text-santaGrey dark:border-iridium">
                                    Master SKU: {row.master_sku || '-'}
                                  </span>
                                  {isHover?.order_items?.order_items.map((item: OrderItems) => (
                                    <div key={item?._id} className="mt-4 flex flex-col items-start">
                                      <div className="text-sm font-normal">
                                        Order:
                                        <Link
                                          className="ml-2 cursor-pointer underline"
                                          href={`/orders/${item?.purchase_order}`}
                                        >
                                          {item?.purchase_order || '-'}
                                        </Link>
                                      </div>
                                      <span className="text-sm font-normal">
                                        Qty: {item?.retailer_qtyordered || '-'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </td>
                            {row?.divide_into_pack.length === 0 && (
                              <>
                                <td
                                  scope="row"
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  -
                                </td>
                                <td
                                  scope="row"
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  -
                                </td>
                              </>
                            )}
                          </tr>
                          {row?.divide_into_pack?.map(
                            (item: DivideIntoPack, indexChildren: number) => (
                              <tr key={indexChildren}>
                                <td
                                  scope="row"
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  <p>{item?.size || '-'}</p>
                                </td>
                                <td
                                  scope="row"
                                  className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100"
                                >
                                  <p>{item?.number || '-'}</p>
                                </td>
                              </tr>
                            )
                          )}
                        </>
                      );
                    })}
              </tbody>
            </table>
            {dataDaily?.length === 0 && !loading && (
              <div className="flex w-full items-center justify-center bg-paperLight py-10 dark:bg-darkGreen">
                No Data
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="item-centers header_cus flex w-full justify-center rounded-b-lg border-t border-lightLine bg-paperLight py-2 dark:border-iridium dark:bg-darkGreen">
        <Pagination
          onPageChange={onPageChange}
          totalCount={totalCount || 0}
          siblingCount={1 || 0}
          currentPage={page || 0}
          pageSize={rowsPerPage || 0}
          color="hover:bg-thunder hover:text-dodgerBlue text-mistBlue"
          previousBtn={
            <Image src="/previous-icon.svg" width={20} height={20} alt="Picture of the author" />
          }
          nextBtn={
            <Image src="/next-icon.svg" width={20} height={20} alt="Picture of the author" />
          }
        />
      </div>
    </div>
  );
};
