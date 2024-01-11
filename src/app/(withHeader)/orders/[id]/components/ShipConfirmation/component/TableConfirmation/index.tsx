import { SetStateAction, useMemo, useState } from 'react';
import clsx from 'clsx';

import {
  BarCode,
  Order,
  OrderItemPackages,
  OrderPackage,
  ShipmentPackages
} from '@/app/(withHeader)/orders/interface';
import { Button } from '@/components/ui/Button';
import { CREATED, LOWES, SUBMITTED, VOIDED, base64ToImage } from '@/constants';
import { useStore } from '@/app/(withHeader)/orders/context';
import * as actions from '@/app/(withHeader)/orders/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';

import IconArrowDown from 'public/down.svg';
import IconRight from 'public/right.svg';
import { Status } from '@/components/ui/Status';
import { getOrderDetailServer, voidShipService } from '@/app/(withHeader)/orders/fetch';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import useToggleModal from '@/hooks/useToggleModal';
import ModalConfirmVoid from '../../../ModalConfirmVoid';

const headerTableWarehouse = [
  {
    id: 'id',
    label: 'No.'
  },
  {
    id: 'packages',
    label: 'Packages'
  },
  {
    id: 'status',
    label: 'Status'
  },
  {
    id: 'tracking_number',
    label: 'Tracking Number'
  },
  {
    id: 'shipping_method',
    label: 'Shipping Method'
  },
  {
    id: 'prints',
    label: 'Prints'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

const TableConfirmation = ({
  orderDetail,
  rowToggle,
  handleToggleRow,
  setPrint,
  handleOpenLabel,
  orderPackageShipped
}: {
  orderDetail: Order;
  rowToggle: number | undefined;
  handleToggleRow: (value: number | undefined) => void;
  setPrint: (
    value: SetStateAction<{
      barcode: BarCode[];
      gs1: string | null;
      label: string;
    }>
  ) => void;
  handleOpenLabel: (data: any) => Promise<void>;
  orderPackageShipped: OrderPackage[];
}) => {
  const { openModal, handleToggleModal } = useToggleModal();
  const {
    state: { isLoadingVoidShip },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const [itemVoid, setItemVoid] = useState<ShipmentPackages[] | null>(null);

  const isDisableVoid = (status: string) => {
    return [VOIDED, SUBMITTED].includes(status?.toLowerCase());
  };

  const onOpenModalVoid = (listItemShipment: ShipmentPackages[]) => {
    handleToggleModal();
    setItemVoid(listItemShipment);
  };

  const onCloseModalVoid = () => {
    handleToggleModal();
    setItemVoid(null);
  };

  const onVoidShip = async (listItemShipment: ShipmentPackages[]) => {
    const itemShipment = listItemShipment?.find(
      (item: { status: string }) => item?.status?.toLowerCase() === CREATED
    );
    try {
      dispatch(actions.voidShipRequest());
      if (itemShipment?.id) {
        await voidShipService(itemShipment.id);
        dispatch(actions.voidShipSuccess());
        const dataOrder = await getOrderDetailServer(+orderDetail?.id);
        dispatch(actions.setOrderDetail(dataOrder));
        onCloseModalVoid();
        dispatchAlert(
          openAlertMessage({
            message: 'Void Shipment Successfully',
            color: 'success',
            title: 'Success'
          })
        );
      }
    } catch (error: any) {
      dispatch(actions.voidShipFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Void Shipment Error',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  return (
    <div className="custom_header_light dark:header_cus flex-col rounded-lg border">
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead className="bg-neutralLight dark:bg-gunmetal">
            <tr>
              {headerTableWarehouse.map((item) => (
                <th
                  key={item.id}
                  scope="col"
                  className={clsx(
                    'border-b border-r border-lightLine px-6 py-3 text-center text-xs font-semibold capitalize text-lightPrimary dark:border-iridium dark:text-santaGrey',
                    {
                      'w-[200px]': item.id === 'packages'
                    }
                  )}
                >
                  {item.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-lightLine bg-paperLight dark:divide-iridium dark:bg-darkGreen">
            {orderPackageShipped?.map((item, index) => {
              return (
                <>
                  <tr
                    key={index}
                    className="cursor-pointer hover:bg-neutralLight dark:hover:bg-gunmetal"
                  >
                    <td className="whitespace-nowrap border-r border-lightLine p-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                      <div className="flex items-center">
                        {rowToggle === index ? (
                          <Button onClick={() => handleToggleRow(undefined)}>
                            <IconArrowDown className="h-[12px] w-[12px]" />
                          </Button>
                        ) : (
                          <Button onClick={() => handleToggleRow(index)}>
                            <IconRight className="h-[12px] w-[12px]" />
                          </Button>
                        )}
                        #{index + 1} {item.package}
                      </div>
                    </td>
                    <td className="whitespace-nowrap border-r border-lightLine p-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                      {item?.box?.name}
                    </td>
                    <td className="whitespace-nowrap border-r border-lightLine p-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                      <table className="w-full">
                        <tbody>
                          {item?.shipment_packages?.length > 0 ? (
                            <>
                              {item?.shipment_packages?.map(
                                (itemShip: ShipmentPackages, indexChildren: number) => (
                                  <tr key={indexChildren}>
                                    <td
                                      className={clsx(
                                        'border-b border-lightLine py-2 dark:border-iridium',
                                        {
                                          'border-none':
                                            indexChildren === item?.shipment_packages.length - 1
                                        }
                                      )}
                                    >
                                      <div className="px-3">
                                        <Status name={itemShip?.status} />
                                      </div>
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
                    <td className="whitespace-nowrap border-r border-lightLine p-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                      <table className="w-full">
                        <tbody>
                          {item?.shipment_packages?.length > 0 ? (
                            <>
                              {item?.shipment_packages?.map(
                                (itemShip: ShipmentPackages, indexChildren: number) => (
                                  <tr key={indexChildren}>
                                    <td
                                      className={clsx(
                                        'border-b border-lightLine px-3 py-2 dark:border-iridium',
                                        {
                                          'border-none':
                                            indexChildren === item?.shipment_packages.length - 1
                                        }
                                      )}
                                    >
                                      <div>{itemShip?.tracking_number}</div>
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
                    <td className="whitespace-nowrap border-r border-lightLine p-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                      <table className="w-full">
                        <tbody>
                          {item?.shipment_packages?.length > 0 ? (
                            <>
                              {item?.shipment_packages?.map(
                                (itemShip: ShipmentPackages, indexChildren: number) => (
                                  <tr key={indexChildren}>
                                    <td
                                      className={clsx(
                                        'border-b border-lightLine px-3 py-2 dark:border-iridium',
                                        {
                                          'border-none':
                                            indexChildren === item?.shipment_packages.length - 1
                                        }
                                      )}
                                    >
                                      {itemShip?.type?.name}
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
                    <td className="whitespace-nowrap border-r border-lightLine p-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                      <table className="w-full">
                        <tbody>
                          {item?.shipment_packages?.length > 0 ? (
                            <>
                              {item?.shipment_packages?.map(
                                (itemShip: ShipmentPackages, indexChildren: number) => (
                                  <tr key={indexChildren}>
                                    <td
                                      className={clsx(
                                        'border-b border-lightLine dark:border-iridium',
                                        {
                                          'border-none':
                                            indexChildren === item?.shipment_packages.length - 1
                                        }
                                      )}
                                    >
                                      {[VOIDED].includes(itemShip?.status?.toLowerCase()) ? (
                                        <div className="flex h-8 items-center justify-center">
                                          -
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-between">
                                          <Button
                                            disabled={item.order_item_packages.some(
                                              (item: OrderItemPackages) =>
                                                !item?.retailer_purchase_order_item?.product_alias
                                                  ?.upc
                                            )}
                                            onClick={() => {
                                              setPrint({
                                                gs1: null,
                                                label: '',
                                                barcode: item.order_item_packages.some(
                                                  (item: OrderItemPackages) => ({
                                                    quantity: item.quantity,
                                                    upc: item?.retailer_purchase_order_item
                                                      ?.product_alias?.upc,
                                                    sku: item.retailer_purchase_order_item
                                                      ?.product_alias?.sku
                                                  })
                                                )
                                                  ? item.order_item_packages.map(
                                                      (ele: OrderItemPackages) => {
                                                        return {
                                                          quantity: ele.quantity,
                                                          upc: ele?.retailer_purchase_order_item
                                                            ?.product_alias?.upc,
                                                          sku: ele.retailer_purchase_order_item
                                                            ?.product_alias?.sku
                                                        };
                                                      }
                                                    )
                                                  : []
                                              });
                                            }}
                                            className="text-dodgeBlue underline"
                                          >
                                            Barcodes
                                          </Button>
                                          {itemShip?.sscc &&
                                            orderDetail?.batch?.retailer?.name?.toLowerCase() ===
                                              LOWES && (
                                              <Button
                                                onClick={() =>
                                                  setPrint({
                                                    label: '',
                                                    barcode: [],
                                                    gs1: itemShip?.sscc
                                                  })
                                                }
                                                className="text-dodgeBlue underline"
                                              >
                                                GS1
                                              </Button>
                                            )}

                                          <Button
                                            onClick={() => {
                                              handleOpenLabel({
                                                label: itemShip?.package_document,
                                                barcode: null,
                                                gs1: null
                                              });
                                            }}
                                            className="text-dodgeBlue underline"
                                          >
                                            Label
                                          </Button>
                                        </div>
                                      )}
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
                    <td className="whitespace-nowrap border-r border-lightLine p-0 text-center text-sm font-normal text-lightPrimary dark:border-iridium dark:text-gey100">
                      <table className="w-full">
                        <tbody>
                          {item?.shipment_packages?.length > 0 ? (
                            <>
                              {item?.shipment_packages?.map((itemShip, indexChildren: number) => (
                                <tr key={indexChildren}>
                                  <td
                                    className={clsx(
                                      'border-b border-lightLine py-2 dark:border-iridium',
                                      {
                                        'border-none':
                                          indexChildren === item?.shipment_packages.length - 1
                                      }
                                    )}
                                  >
                                    <button
                                      disabled={
                                        isLoadingVoidShip || isDisableVoid(itemShip?.status)
                                      }
                                      className={`text-dodgeBlue underline ${
                                        isDisableVoid(itemShip?.status) &&
                                        'cursor-not-allowed text-grey600'
                                      }`}
                                      type="button"
                                      onClick={() => onOpenModalVoid(item?.shipment_packages)}
                                    >
                                      Void
                                    </button>
                                  </td>
                                </tr>
                              ))}
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
                  </tr>
                  {rowToggle === index && (
                    <tr
                      id="expandable-row-2"
                      className="expandable-row bg-neutralLight dark:bg-gunmetal"
                    >
                      <td className="whitespace-nowrap py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100"></td>
                      <td className="whitespace-nowrap py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th>Product</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item?.order_item_packages?.map((element: any) => (
                              <tr key={element?.id}>
                                <td className="whitespace-nowrap py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                                  {element?.retailer_purchase_order_item?.product_alias?.sku}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                      <td className="whitespace-nowrap py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th>Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {item?.order_item_packages?.map((element: any) => (
                              <tr key={element?.id}>
                                <td className="whitespace-nowrap py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                                  {element?.quantity}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                      <td className="whitespace-nowrap py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th>SSCC ID</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array(item?.order_item_packages?.length)
                              .fill(0)
                              .map((_, index) => (
                                <tr key={index}>
                                  <td className="whitespace-nowrap py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                                    {item?.shipment_packages?.[item?.shipment_packages?.length - 1]
                                      ?.sscc || '-'}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </td>
                      {Array(4)
                        .fill(0)
                        .map((_, index) => (
                          <td
                            className="whitespace-nowrap py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100"
                            key={index}
                          />
                        ))}
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
        {orderPackageShipped?.length === 0 && (
          <div className="flex w-full items-center justify-center bg-paperLight py-10 dark:bg-darkGreen">
            No Data
          </div>
        )}
      </div>
      <ModalConfirmVoid
        onVoidShip={onVoidShip}
        handleCloseModal={onCloseModalVoid}
        openModal={openModal}
        itemVoid={itemVoid}
        isLoadingVoidShip={isLoadingVoidShip}
      />
    </div>
  );
};

export default TableConfirmation;
