import clsx from 'clsx';
import Image from 'next/image';

import DeleteIcon from 'public/delete.svg';
import IconAction from 'public/three-dots.svg';
import PenIcon from '/public/pencil.svg';

import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { Dropdown } from '@/components/ui/Dropdown';
import { PackageDivide, ProductPackage } from '../../constants';

interface IProp {
  columns: {
    id: string;
    label: string;
  }[];
  dataPackage: PackageDivide[];
  siblingCount?: number;
  totalCount?: number;
  currentPage: number;
  pageSize?: number;
  loading?: boolean;
  selectAllTable?: () => void;
  selectItemTable?: (value: number) => void;
  onClickItem?: (value: string | number) => void;
  onPageChange: (value: string | number) => void;
  handleEditRowPack: (value: PackageDivide) => void;
}

export default function TablePackage({
  columns,
  siblingCount,
  dataPackage,
  totalCount,
  currentPage,
  pageSize,
  loading,
  onPageChange,
  selectItemTable,
  handleEditRowPack
}: IProp) {
  const handleEditRow = (row: PackageDivide) => {
    handleEditRowPack && handleEditRowPack(row);
  };

  return (
    <div className="custom_header_light dark:header_cus flex-col rounded-lg border">
      <div className="overflow-x-auto">
        <div className="inline-block w-full align-middle">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead className="bg-neutralLight dark:bg-gunmetal">
                <tr>
                  {columns?.map((column: any) => (
                    <th
                      className="text-centerfont-semibold border-b border-r border-lightLine px-[16px] py-[8px] capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey"
                      key={column.id}
                    >
                      <p className="text-[11px]">{column.label}</p>
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
                          </tr>
                        );
                      })
                  : dataPackage?.map((row: PackageDivide, index: number) => {
                      return (
                        <tr key={index}>
                          <td className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                            <div>{row?.box_name || '-'}</div>
                          </td>
                          <td className="whitespace-nowrap border-r border-lightLine px-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                            <table className="w-full">
                              <tbody>
                                {row?.products?.map(
                                  (item: ProductPackage, indexChildren: number) => (
                                    <tr key={indexChildren}>
                                      <td
                                        className={`border-b border-lightLine py-2 dark:border-iridium ${
                                          indexChildren === row.products.length - 1
                                            ? 'border-none'
                                            : ''
                                        }`}
                                      >
                                        <p>{item?.item || '-'}</p>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </td>
                          <td className="whitespace-nowrap border-r border-lightLine px-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                            <table className="w-full">
                              <tbody>
                                {row?.products?.map(
                                  (item: ProductPackage, indexChildren: number) => (
                                    <tr key={indexChildren}>
                                      <td
                                        className={`border-b border-lightLine py-2 dark:border-iridium ${
                                          indexChildren === row.products.length - 1
                                            ? 'border-none'
                                            : ''
                                        }`}
                                      >
                                        <p>{item?.qty || '-'}</p>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </td>
                          <td className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                            <div
                              className="flex items-center justify-center"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <div className="absolute">
                                <Dropdown
                                  mainMenu={<IconAction />}
                                  className="left-0 w-[100px] dark:bg-gunmetal"
                                >
                                  <div className="z-50 rounded-lg ">
                                    <Button onClick={() => handleEditRow(row)}>
                                      <PenIcon />
                                      <span className="items-start text-lightPrimary  dark:text-santaGrey">
                                        Edit
                                      </span>
                                    </Button>
                                    <Button>
                                      <DeleteIcon />
                                      <span className="items-start text-lightPrimary  dark:text-santaGrey">
                                        Delete
                                      </span>
                                    </Button>
                                  </div>
                                </Dropdown>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>

            {dataPackage?.length === 0 && !loading && (
              <div className="flex w-full items-center justify-center bg-paperLight py-10 dark:bg-darkGreen">
                No Data
              </div>
            )}
          </div>
        </div>
      </div>
      {dataPackage?.length > 0 && (
        <div className="item-centers header_cus flex w-full justify-center rounded-b-lg border-t border-lightLine bg-paperLight py-2 dark:border-iridium dark:bg-darkGreen">
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
          />
        </div>
      )}
    </div>
  );
}
