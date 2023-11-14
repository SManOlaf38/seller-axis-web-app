import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';

import IconDelete from 'public/delete.svg';
import { CheckBox } from '@/components/ui/CheckBox';
import DeleteIcon from 'public/delete.svg';
import IconAction from 'public/three-dots.svg';
import PenIcon from '/public/pencil.svg';

import { setOrderDetail } from '@/app/(withHeader)/orders/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/orders/context';
import * as actions from '@/app/(withHeader)/orders/context/action';
import * as services from '@/app/(withHeader)/orders/fetch';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { openAlertMessage } from '@/components/ui/Alert/context/action';

import type { Order, OrderItemPackages, OrderPackages } from '@/app/(withHeader)/orders/interface';

interface IProp {
  columns: {
    id: string;
    label: string;
  }[];
  dataPackage: OrderPackages[];
  loading?: boolean;
  selectedItems: number[];
  orderDetail: Order;
  setItemPackageDeleted: Dispatch<SetStateAction<OrderItemPackages[]>>;
  selectAllTable?: () => void;
  onClickItem?: (value: string | number) => void;
  handleEditRowPack: (value: OrderPackages) => void;
  selectItemTable: (id: number) => void;
  handleDeleteBulkItem: (ids: number[]) => Promise<void>;
}

export default function TablePackage({
  columns,
  dataPackage,
  loading,
  selectedItems,
  orderDetail,
  handleEditRowPack,
  setItemPackageDeleted,
  selectAllTable,
  handleDeleteBulkItem,
  selectItemTable
}: IProp) {
  const {
    state: { isLoadingDeleteOrderPackage },
    dispatch
  } = useStore();
  const params = useParams();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const handleEditRow = (row: OrderPackages) => {
    handleEditRowPack && handleEditRowPack(row);
  };

  const handleDeleteRow = async (id: number) => {
    const itemDeleted = dataPackage?.find((item) => item?.id === id);
    try {
      dispatch(actions.deleteOrderPackageRequest());
      await services.deleteOrderPackageService(id);
      dispatch(actions.deleteOrderPackageSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Order Package Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      itemDeleted &&
        setItemPackageDeleted((prevChangedStates) => [
          ...prevChangedStates,
          ...itemDeleted?.order_item_packages
        ]);
      const dataOrder = await services.getOrderDetailServer(+params?.id);
      dispatch(setOrderDetail(dataOrder));
    } catch (error: any) {
      dispatch(actions.deleteOrderPackageFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleSelectItemTable = (value: number) => () => {
    selectItemTable && selectItemTable(value);
  };

  const handleDeleteBulkPackage = (ids: number[]) => {
    handleDeleteBulkItem && handleDeleteBulkItem(ids);
  };

  return (
    <div className="custom_header_light dark:header_cus flex-col rounded-lg border">
      <div className="max-h-[410px] overflow-x-auto overflow-y-auto">
        <div className="inline-block w-full align-middle">
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full">
              <thead className="bg-neutralLight dark:bg-gunmetal">
                <tr>
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
                          dataPackage.length === selectedItems.length
                        }
                        onChange={selectAllTable}
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
                                <Button onClick={() => handleDeleteBulkPackage(selectedItems)}>
                                  <IconDelete />
                                  <span className="items-start text-lightPrimary  dark:text-santaGrey">
                                    Delete
                                  </span>
                                </Button>
                              </div>
                            </Dropdown>
                          </div>
                        </div>
                      )}
                    </div>
                  </th>
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
                  : dataPackage?.map((row: OrderPackages, index: number) => {
                      return (
                        <tr key={index}>
                          <td className="w-[60px] border-r border-lightLine py-3 pl-4 dark:border-iridium">
                            <div className="flex h-5 items-center">
                              <CheckBox
                                checked={selectedItems?.includes(+row.id)}
                                onChange={handleSelectItemTable(+row.id)}
                                className="rounded "
                              />
                            </div>
                          </td>
                          <td className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                            <span>#{index + 1}</span>
                          </td>
                          <td className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                            <div>
                              {row?.box?.name || '-'}{' '}
                              <span className="text-xs text-primary500">
                                (
                                {row?.order_item_packages?.reduce(
                                  (acc: number, product: OrderItemPackages) => {
                                    const skuQuantity =
                                      product?.retailer_purchase_order_item?.product_alias
                                        ?.sku_quantity || 0;
                                    return acc + (product?.quantity || 0) * skuQuantity;
                                  },
                                  0
                                ) || '-'}{' '}
                                / {row?.box_max_quantity || '-'})
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap border-r border-lightLine px-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                            <table className="w-full">
                              <tbody>
                                {row?.order_item_packages ? (
                                  <>
                                    {row?.order_item_packages?.map(
                                      (item: OrderItemPackages, indexChildren: number) => (
                                        <tr key={indexChildren}>
                                          <td
                                            className={clsx(
                                              'border-b border-lightLine py-2 dark:border-iridium',
                                              {
                                                'border-none':
                                                  indexChildren ===
                                                  row?.order_item_packages.length - 1
                                              }
                                            )}
                                          >
                                            <p className="w-[165px] whitespace-normal break-words">
                                              {item?.retailer_purchase_order_item?.product_alias
                                                ?.sku || '-'}
                                            </p>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </>
                                ) : (
                                  <tr>
                                    <td className="border-b border-lightLine py-2 dark:border-iridium">
                                      <p>-</p>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </td>
                          <td className="whitespace-nowrap border-r border-lightLine px-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                            <table className="w-full">
                              <tbody>
                                {row?.order_item_packages ? (
                                  <>
                                    {row?.order_item_packages?.map(
                                      (item: OrderItemPackages, indexChildren: number) => (
                                        <tr key={indexChildren}>
                                          <td
                                            className={clsx(
                                              'border-b border-lightLine py-2 dark:border-iridium',
                                              {
                                                'border-none':
                                                  indexChildren ===
                                                  row?.order_item_packages.length - 1
                                              }
                                            )}
                                          >
                                            {item?.quantity || '-'}{' '}
                                            <span className="text-xs text-primary500">
                                              (x
                                              {item?.retailer_purchase_order_item?.product_alias
                                                ?.sku_quantity || '-'}
                                              )
                                            </span>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </>
                                ) : (
                                  <tr>
                                    <td className="border-b border-lightLine py-2 dark:border-iridium">
                                      <p>-</p>
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </td>
                          <td className="whitespace-nowrap border-r border-lightLine px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                            <div
                              className="flex items-center justify-center"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <Dropdown
                                classButton="justify-center"
                                mainMenu={<IconAction />}
                                className="fixed right-[27px] top-[-50px] w-[100px] dark:bg-gunmetal"
                              >
                                <div className="z-50 m-auto rounded-lg">
                                  <Button onClick={() => handleEditRow(row)}>
                                    <PenIcon />
                                    <span className="items-start text-lightPrimary dark:text-santaGrey">
                                      Edit
                                    </span>
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteRow(+row.id)}
                                    isLoading={isLoadingDeleteOrderPackage}
                                    disabled={isLoadingDeleteOrderPackage}
                                  >
                                    <DeleteIcon />
                                    <span className="items-start text-lightPrimary dark:text-santaGrey">
                                      Delete
                                    </span>
                                  </Button>
                                </div>
                              </Dropdown>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>

            {dataPackage?.length === 0 && !loading && (
              <p className="flex items-center justify-center py-10">
                {orderDetail?.order_full_divide ? 'This order shipped all box' : 'No Data'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
