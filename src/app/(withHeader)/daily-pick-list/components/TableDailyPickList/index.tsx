import Image from 'next/image';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import clsx from 'clsx';
import { useMemo } from 'react';

import { Button } from '@/components/ui/Button';
import { CheckBox } from '@/components/ui/CheckBox';
import { Pagination } from '@/components/ui/Pagination';
import { Dropdown } from '@/components/ui/Dropdown';
import DownloadIcon from 'public/download.svg';
import IconAction from 'public/three-dots.svg';
import useSelectTable from '@/hooks/useSelectTable';

import { DailyPickList, Group } from '../../interfaces';

type Props = {
  dataDailyPickList: DailyPickList[];
  groupNames: [];
  isLoading: boolean;
  rowsPerPage: number;
  page: number;
  onPageChange: (value: string | number) => void;
};

export default function TableDailyPickList({
  dataDailyPickList,
  groupNames,
  isLoading,
  rowsPerPage,
  page,
  onPageChange
}: Props) {
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: dataDailyPickList
  });

  const handleSelectItemTable = (value: number) => () => {
    onSelectItem(value);
  };

  const itemSelected = useMemo(() => {
    return dataDailyPickList?.filter((item: DailyPickList) => selectedItems?.includes(item?.id));
  }, [dataDailyPickList, selectedItems]);

  const handlePrintItemSelected = () => {
    const doc = new jsPDF();
    const dataHeader = [
      'Product SKU',
      groupNames?.map((groupName) => `${groupName} PK`),
      'Sub-Quantity',
      'Available Quantity'
    ];
    const printHeader = [
      'Product SKU',
      ...(dataHeader[1] as never),
      'Sub-Quantity',
      'Available Quantity'
    ] as never;
    const body = itemSelected?.map((item: DailyPickList) => [
      item.product_sku,
      ...item.group.map((itemGroup: Group) => (itemGroup.count ? itemGroup.count : '--')),
      item.quantity,
      item.available_quantity
    ]);

    autoTable(doc, {
      theme: 'grid',
      head: [printHeader],
      body: body
    });
    doc.save('daily_pick_list.pdf');
  };

  return (
    <div className="custom_header_light dark:header_cus flex flex-col rounded-lg border">
      <div className="overflow-x-auto">
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full">
            <thead className="bg-neutralLight dark:bg-gunmetal">
              <tr>
                <th scope="col" className="relative px-4 py-2">
                  <div className="flex h-5 items-center">
                    <CheckBox
                      checked={
                        selectedItems &&
                        selectedItems.length > 0 &&
                        dataDailyPickList?.length === selectedItems.length
                      }
                      onChange={onSelectAll}
                      className="rounded"
                    />
                    {selectedItems && dataDailyPickList?.length > 0 && selectedItems.length > 0 && (
                      <div className="absolute right-0 flex items-center justify-center">
                        <div className="relative pl-2">
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
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold capitalize text-lightPrimary dark:text-santaGrey"
                >
                  Product SKU
                </th>
                {!isLoading &&
                  groupNames?.map((groupName) => (
                    <th
                      key={groupName}
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-semibold capitalize text-lightPrimary dark:text-santaGrey"
                    >{`${groupName} PK`}</th>
                  ))}

                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold capitalize text-lightPrimary dark:text-santaGrey"
                >
                  Sub-Quantity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-center text-xs font-semibold capitalize text-lightPrimary dark:text-santaGrey"
                >
                  Available Quantity
                </th>
              </tr>
            </thead>
            <tbody
              className={clsx(
                'divide-y divide-lightLine bg-paperLight dark:divide-iridium dark:bg-darkGreen',
                {
                  'animate-pulse': isLoading
                }
              )}
            >
              {isLoading
                ? Array(8)
                    .fill(0)
                    .map((_, index) => {
                      return (
                        <tr key={index}>
                          <td className="py-3 pl-4">
                            <div className="my-3 h-2 w-10 bg-grey500 dark:bg-gray-500 " />
                          </td>

                          <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                            <div className="flex items-center justify-center">
                              <div className="my-2 h-2 w-32 bg-grey500 dark:bg-gray-500" />
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                            <div className="flex items-center justify-center">
                              <div className="my-2 h-2 w-32 bg-grey500 dark:bg-gray-500" />
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                            <div className="flex items-center justify-center">
                              <div className="my-2 h-2 w-32 bg-grey500 dark:bg-gray-500" />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                : dataDailyPickList?.map((item) => (
                    <tr
                      key={item.id}
                      className="cursor-pointer hover:bg-neutralLight dark:hover:bg-gunmetal"
                    >
                      <td className="w-[60px] py-3 pl-4">
                        <div className="flex h-5 items-center">
                          <CheckBox
                            checked={selectedItems?.includes(item.id) || false}
                            onChange={handleSelectItemTable(item.id)}
                            className="rounded "
                          />
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                        {item.product_sku}
                      </td>
                      {groupNames?.map((groupName) => {
                        const group = item?.group?.find((group) => group?.name === groupName);
                        return (
                          <td
                            key={`${item.id}-${groupName}`}
                            className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100"
                          >
                            {group && group.count !== 0 ? group.count : '--'}
                          </td>
                        );
                      })}
                      <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                        {item.quantity}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                        {item.available_quantity}
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {dataDailyPickList?.length === 0 && !isLoading && (
            <div className="flex w-full items-center justify-center bg-paperLight py-10 dark:bg-darkGreen">
              No Data
            </div>
          )}
        </div>
      </div>
      <div className="item-centers header_cus flex w-full justify-center rounded-b-lg border-t border-lightLine bg-paperLight py-2 dark:border-iridium dark:bg-darkGreen">
        <Pagination
          onPageChange={onPageChange}
          totalCount={dataDailyPickList?.length}
          siblingCount={1}
          currentPage={page + 1 || 0}
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
}
