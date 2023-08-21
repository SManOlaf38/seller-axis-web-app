'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import JsBarcode from 'jsbarcode';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import {
  Order,
  OrderItemPackages,
  OrderPackage,
  ShipConfirmationType,
  ShipmentPackages
} from '../../../interface';

import PrintModalGS1 from './component/ModalGS1';
import PrintModalBarcode from './component/ModalPrintBarcode';

import IconArrowDown from 'public/down.svg';
import IconRight from 'public/right.svg';
import { base64ToImage } from '@/constants';

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

export default function ShipConfirmation({
  detail,
  orderDetail
}: {
  detail: ShipConfirmationType[];
  orderDetail: Order;
}) {
  const [rowToggle, setRowToggle] = useState<number | undefined>(undefined);
  const [barcodeData, setBarcodeData] = useState<string[]>([]);
  const [shipToPostBarcode, setShipToPostBarcode] = useState<string>('');
  const [forBarcode, setForBarcode] = useState<string>('');
  const [ssccBarcode, setSsccBarcode] = useState<string>('');
  const [print, setPrint] = useState<{
    barcode: string[];
    gs1: OrderPackage | null;
  }>({
    barcode: [],
    gs1: null
  });

  const handleCloseModal = () => {
    setPrint({
      barcode: [],
      gs1: null
    });
  };

  const handleToggleRow = (value: number | undefined) => {
    setRowToggle(value);
  };

  const handleOpenLabel = async (data: any) => {
    if (data.label.includes('http')) {
      window.open(data.label, '_blank');
      setPrint(data);
    } else {
      const newWindow = window.open('', '_blank');

      if (newWindow) {
        newWindow.document.write('<html><head><title>Image</title></head><body>');
        newWindow.document.write(`<img src=${data.label} alt="Image">`);
        newWindow.document.write('</body></html>');
      } else {
        console.error('Failed to open image window.');
      }
    }
  };

  useEffect(() => {
    if (print.gs1?.id && orderDetail && orderDetail?.ship_to) {
      let canvas;
      canvas = document.createElement('canvas');
      JsBarcode(canvas, orderDetail?.ship_to?.postal_code, {
        displayValue: false
      });
      const tempShipToBarcode = canvas.toDataURL();
      setShipToPostBarcode(tempShipToBarcode);

      if (orderDetail?.ship_to?.partner_person_place_id) {
        JsBarcode(canvas, orderDetail?.ship_to?.partner_person_place_id, {
          displayValue: false
        });
        const tempForBarcode = canvas?.toDataURL();
        setForBarcode(tempForBarcode);
      }

      if (print?.gs1?.shipment_packages[0]?.sscc) {
        JsBarcode(canvas, print.gs1.shipment_packages[0].sscc, {
          displayValue: false,
          height: 200
        });
        const tempSsccBarcode = canvas.toDataURL();
        setSsccBarcode(tempSsccBarcode);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetail, orderDetail.id, print.gs1?.id, print.gs1?.shipment_packages?.length]);

  useEffect(() => {
    const barcodeArr: string[] = [];
    print.barcode?.forEach((data) => {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, data);

      const rotatedCanvas = document.createElement('canvas');
      rotatedCanvas.width = canvas.height;
      rotatedCanvas.height = canvas.width;
      const ctx: any = rotatedCanvas.getContext('2d');
      ctx.translate(rotatedCanvas.width / 2, rotatedCanvas.height / 2);
      ctx.rotate((3 * Math.PI) / 2);
      ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

      const barcode = rotatedCanvas.toDataURL();
      barcodeArr.push(barcode);
    });

    setBarcodeData(barcodeArr);
  }, [print.barcode, print.barcode?.length]);
  return (
    <>
      <CardToggle title="Shipment Confirmation" className="grid w-full grid-cols-1 gap-4">
        <table className="min-w-full ">
          <thead className="bg-neutralLight dark:bg-gunmetal">
            <tr>
              {headerTableWarehouse.map((item, index) => (
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
                        #{index} {item.package}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                      {item?.box?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                      {item?.shipment_packages?.map((item: ShipmentPackages) => (
                        <div key={item.id}>{item?.tracking_number}</div>
                      ))}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                      {item.shipment_packages[0]?.type?.code}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                      <div className="flex items-center justify-between">
                        <Button
                          onClick={() => {
                            setPrint({
                              gs1: null,
                              barcode: item.order_item_packages.map(
                                (ele: OrderItemPackages) => ele?.retailer_purchase_order_item?.upc
                              )
                            });
                          }}
                          className="text-dodgeBlue underline"
                        >
                          Barcodes
                        </Button>
                        {orderDetail.carrier?.retailer?.merchant_id === 'Lowes' && (
                          <Button
                            disabled={
                              item?.shipment_packages?.length === 0 ||
                              orderDetail.carrier?.retailer?.merchant_id !== 'Lowes'
                            }
                            onClick={() => {
                              setPrint({
                                barcode: [],
                                gs1: item
                              });
                            }}
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
                                label: item?.shipment_packages[0]?.package_document.includes('http')
                                  ? item?.shipment_packages[0]?.package_document
                                  : base64ToImage(item?.shipment_packages[0]?.package_document),
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
      </CardToggle>

      <PrintModalBarcode
        open={print?.barcode?.length > 0}
        onClose={handleCloseModal}
        barcodeData={barcodeData}
      />

      <PrintModalGS1
        barcodeData={barcodeData}
        open={!!print.gs1?.id}
        onClose={handleCloseModal}
        forBarcode={forBarcode}
        print={print}
        ssccBarcode={ssccBarcode}
        orderDetail={orderDetail}
        shipToPostBarcode={shipToPostBarcode}
      />
    </>
  );
}
