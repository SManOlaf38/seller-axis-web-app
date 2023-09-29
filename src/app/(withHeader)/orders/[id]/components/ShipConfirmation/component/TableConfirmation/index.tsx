import { SetStateAction } from 'react';
import clsx from 'clsx';

import {
  BarCode,
  Order,
  OrderItemPackages,
  OrderPackage,
  ShipmentPackages
} from '@/app/(withHeader)/orders/interface';
import { Button } from '@/components/ui/Button';
import { base64ToImage } from '@/constants';

import IconArrowDown from 'public/down.svg';
import IconRight from 'public/right.svg';

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
  }
];

const TableConfirmation = ({
  orderDetail,
  rowToggle,
  handleToggleRow,
  setPrint,
  handleOpenLabel
}: {
  orderDetail: Order;
  rowToggle: number | undefined;
  handleToggleRow: (value: number | undefined) => void;
  setPrint: (
    value: SetStateAction<{
      barcode: BarCode[];
      gs1: OrderPackage | null;
      label: string;
    }>
  ) => void;
  handleOpenLabel: (data: any) => Promise<void>;
}) => {
  return (
    <table className="min-w-full ">
      <thead className="bg-neutralLight dark:bg-gunmetal">
        <tr>
          {headerTableWarehouse.map((item) => (
            <th
              key={item.id}
              scope="col"
              className={clsx(
                'px-6 py-3 text-center text-xs font-semibold capitalize text-lightPrimary dark:text-santaGrey',
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
        {orderDetail?.order_packages?.map((item, index) => {
          return (
            <>
              <tr
                key={index}
                className="cursor-pointer hover:bg-neutralLight dark:hover:bg-gunmetal"
              >
                <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
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
                <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                  {item?.box?.name}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                  {item?.shipment_packages.length > 0 &&
                    item?.shipment_packages?.map((item: ShipmentPackages) => (
                      <div key={item.id}>{item?.tracking_number}</div>
                    ))}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                  {item?.shipment_packages.length > 0 && item.shipment_packages[0]?.type?.code}
                </td>
                <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                  <div className="flex items-center justify-between">
                    <Button
                      disabled={item.order_item_packages.some(
                        (item: OrderItemPackages) =>
                          !item?.retailer_purchase_order_item?.product_alias?.upc
                      )}
                      onClick={() => {
                        setPrint({
                          gs1: null,
                          label: '',
                          barcode: item.order_item_packages.some((item: OrderItemPackages) => ({
                            quantity: item.quantity,
                            upc: item?.retailer_purchase_order_item?.product_alias?.upc,
                            sku: item.retailer_purchase_order_item?.product_alias?.sku
                          }))
                            ? item.order_item_packages.map((ele: OrderItemPackages) => {
                                return {
                                  quantity: ele.quantity,
                                  upc: ele?.retailer_purchase_order_item?.product_alias?.upc,
                                  sku: ele.retailer_purchase_order_item?.product_alias?.sku
                                };
                              })
                            : []
                        });
                      }}
                      className="text-dodgeBlue underline"
                    >
                      Barcodes
                    </Button>
                    {item?.shipment_packages.length > 0 && item?.shipment_packages[0].sscc && (
                      <Button
                        onClick={() =>
                          setPrint({
                            label: '',
                            barcode: [],
                            gs1: item
                          })
                        }
                        className="text-dodgeBlue underline"
                      >
                        GS1
                      </Button>
                    )}

                    {item?.shipment_packages?.length > 0 && (
                      <Button
                        disabled={item?.shipment_packages?.length === 0}
                        onClick={() => {
                          handleOpenLabel({
                            label: item?.shipment_packages[0]?.package_document,
                            barcode: null,
                            gs1: null
                          });
                        }}
                        className="text-dodgeBlue underline"
                      >
                        Label
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
              {rowToggle === index && (
                <tr
                  id="expandable-row-2"
                  className="expandable-row bg-neutralLight dark:bg-gunmetal"
                >
                  <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100"></td>
                  <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th>Product</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item?.order_item_packages?.map((element: any) => (
                          <tr key={element?.id}>
                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                              {element?.retailer_purchase_order_item?.product_alias?.sku}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item?.order_item_packages?.map((element: any) => (
                          <tr key={element?.id}>
                            <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                              {element?.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100"></td>
                  <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100"></td>
                </tr>
              )}
            </>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableConfirmation;
