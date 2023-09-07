'use client';
import JsBarcode from 'jsbarcode';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { BarCode, Order, OrderPackage } from '../../../interface';
import ModalAllGs1 from './component/ModalAllGs1';
import PrintModalGS1 from './component/ModalGS1';
import PrintModalBarcode from './component/ModalPrintBarcode';
import ModalPrintLabel from './component/ModalPrintLabel';
import PrintModalPackingSlip from './component/ModalPrintPackingSlip';
import TableConfirmation from './component/TableConfirmation';
import ModalPrintAll from './component/ModalPrintAll';

export default function ShipConfirmation({
  orderDetail,
  isPrintAll,
  handleChangeIsPrintAll
}: {
  orderDetail: Order;
  isPrintAll: {
    packingSlip: boolean;
    barcode: boolean;
    label: boolean;
    gs1: boolean;
    all: boolean;
  };
  handleChangeIsPrintAll: (name: 'packingSlip' | 'barcode' | 'label' | 'gs1' | 'all') => void;
}) {
  const [rowToggle, setRowToggle] = useState<number | undefined>(undefined);

  const [barcodeData, setBarcodeData] = useState<BarCode[]>([]);
  const [sscc, setSscc] = useState({
    shipToPostBarcode: '',
    forBarcode: '',
    ssccBarcode: ''
  });

  const [print, setPrint] = useState<{
    barcode: BarCode[];
    gs1: OrderPackage | null;
    label: string;
  }>({
    barcode: [],
    gs1: null,
    label: ''
  });

  const handleCloseModal = () => {
    setPrint({
      barcode: [],
      gs1: null,
      label: ''
    });
  };

  const handleToggleRow = (value: number | undefined) => {
    setRowToggle(value);
  };

  const handleOpenLabel = async (data: {
    barcode: BarCode[];
    gs1: OrderPackage | null;
    label: string;
  }) => {
    setPrint({
      ...print,
      label: data.label
    });
  };

  useEffect(() => {
    if (print.gs1?.id && orderDetail && orderDetail?.ship_to) {
      const dataSscc = {
        shipToPostBarcode: '',
        forBarcode: '',
        ssccBarcode: ''
      };
      let canvas;
      canvas = document.createElement('canvas');
      JsBarcode(canvas, orderDetail?.ship_to?.postal_code, {
        displayValue: false
      });
      const tempShipToBarcode = canvas.toDataURL();

      dataSscc.shipToPostBarcode = tempShipToBarcode;

      if (orderDetail?.ship_to?.partner_person_place_id) {
        JsBarcode(canvas, orderDetail?.ship_to?.partner_person_place_id, {
          displayValue: false
        });
        const tempForBarcode = canvas?.toDataURL();
        dataSscc.forBarcode = tempForBarcode;
      }

      if (print?.gs1?.shipment_packages[0]?.sscc) {
        JsBarcode(canvas, print.gs1.shipment_packages[0].sscc, {
          displayValue: false,
          height: 200
        });
        const tempSsccBarcode = canvas.toDataURL();
        dataSscc.ssccBarcode = tempSsccBarcode;
      }

      setSscc(dataSscc);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetail, orderDetail.id, print.gs1?.id, print.gs1?.shipment_packages?.length]);

  useEffect(() => {
    const barcodeArr: BarCode[] = [];
    print.barcode?.forEach((data: BarCode) => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 3 * 100;
        canvas.height = 100;

        JsBarcode(canvas, data?.upc, {
          format: 'UPC',
          fontSize: 40,
          textMargin: 0
        });

        const barcodeData = {
          quantity: data.quantity,
          sku: data?.sku,
          upc: canvas.toDataURL()
        } as never;

        barcodeArr.push(barcodeData);
      } catch (error) {
        console.error(`Error UPC: ${data?.upc}`, error);
      }
    });

    setBarcodeData(barcodeArr as never);
  }, [print.barcode, print.barcode?.length]);

  const allBarcode = useMemo(() => {
    if (orderDetail.order_packages.length) {
      const combinedArray = orderDetail.order_packages.reduce((result, currentArray) => {
        return result.concat(
          currentArray?.order_item_packages.map((sub: OrderPackage) => ({
            upc: sub.retailer_purchase_order_item?.product_alias.upc,
            sku: sub.retailer_purchase_order_item?.product_alias.sku
          }))
        );
      }, []);

      if (combinedArray.length > 0) {
        const barcodeArr: BarCode[] = [];

        combinedArray?.forEach((data: BarCode) => {
          try {
            const canvas = document.createElement('canvas');
            JsBarcode(canvas, data?.upc, { format: 'UPC' });

            const barcodeData = {
              sku: data?.sku,
              upc: canvas.toDataURL()
            } as never;

            barcodeArr.push(barcodeData);
          } catch (error) {
            console.error(`Error processing UPC: ${data?.upc}`, error);
          }
        });

        return barcodeArr;
      }

      return [];
    }
  }, [orderDetail.order_packages]);

  const printAllGs1 = useMemo(() => {
    let canvas: HTMLCanvasElement;
    if (orderDetail && orderDetail?.ship_to && orderDetail.order_packages.length > 0) {
      const dataSscc: {
        forBarcode: string;
        shipToPostBarcode: string;
        ssccBarcode: string[];
      } = {
        shipToPostBarcode: '',
        forBarcode: '',
        ssccBarcode: []
      };

      canvas = document.createElement('canvas');
      JsBarcode(canvas, orderDetail?.ship_to?.postal_code, {
        displayValue: false
      });
      const tempShipToBarcode = canvas.toDataURL();

      dataSscc.shipToPostBarcode = tempShipToBarcode;

      if (orderDetail?.ship_to?.partner_person_place_id) {
        JsBarcode(canvas, orderDetail?.ship_to?.partner_person_place_id, {
          displayValue: false
        });
        const tempForBarcode = canvas?.toDataURL();
        dataSscc.forBarcode = tempForBarcode;
      }

      if (orderDetail.order_packages.length > 0) {
        const isSscc = orderDetail.order_packages.some((item) => item.shipment_packages[0]?.sscc);

        if (isSscc) {
          const sscc = orderDetail.order_packages.map((item) => {
            const sscc = item.shipment_packages[0]?.sscc;

            JsBarcode(canvas, sscc, {
              displayValue: false,
              height: 200
            });
            const tempSsccBarcode = canvas.toDataURL();
            return tempSsccBarcode;
          });

          dataSscc.ssccBarcode = sscc;
        }
      }

      return dataSscc;
    }
  }, [orderDetail]);

  return (
    <>
      <CardToggle
        title={
          <div className="flex w-full justify-between">
            <div>Shipment confirmation</div>
            <div className="mr-4 flex items-center gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangeIsPrintAll('packingSlip');
                }}
                className="bg-gey100 dark:bg-gunmetal"
              >
                Packing Slip
              </Button>
              {[
                {
                  label: 'Print all',
                  value: 'all'
                },
                {
                  label: 'Print all barcodes',
                  value: 'barcode'
                },
                // {
                //   label: 'Print all labels',
                //   value: 'label'
                // },
                {
                  label: 'Print all GS1s',
                  value: 'gs1'
                }
              ].map((item) => (
                <Button
                  key={item.label}
                  color="bg-primary500"
                  className="text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeIsPrintAll(
                      item.value as 'packingSlip' | 'barcode' | 'label' | 'gs1' | 'all'
                    );
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        }
        className="grid w-full grid-cols-1 gap-4"
      >
        <TableConfirmation
          orderDetail={orderDetail}
          rowToggle={rowToggle}
          handleToggleRow={handleToggleRow}
          setPrint={setPrint}
          handleOpenLabel={handleOpenLabel}
        />
      </CardToggle>

      <PrintModalBarcode
        open={print?.barcode?.length > 0}
        onClose={handleCloseModal}
        barcodeData={barcodeData}
      />

      <ModalPrintLabel
        imagePrint={print.label}
        open={!!print.label}
        handleCloseModal={handleCloseModal}
      />

      <PrintModalGS1
        open={!!print.gs1?.id}
        onClose={handleCloseModal}
        forBarcode={sscc.forBarcode}
        ssccBarcode={sscc.ssccBarcode}
        shipToPostBarcode={sscc.shipToPostBarcode}
        orderDetail={orderDetail}
      />

      <PrintModalPackingSlip
        open={isPrintAll.packingSlip}
        onClose={() => handleChangeIsPrintAll('packingSlip')}
        orderDetail={orderDetail}
      />
      <PrintModalBarcode
        open={isPrintAll.barcode}
        onClose={() => handleChangeIsPrintAll('barcode')}
        barcodeData={allBarcode}
      />

      <ModalAllGs1
        open={isPrintAll.gs1}
        onClose={() => handleChangeIsPrintAll('gs1')}
        printAllGs1={printAllGs1}
        orderDetail={orderDetail}
      />

      <ModalPrintAll
        open={isPrintAll.all}
        onClose={() => handleChangeIsPrintAll('all')}
        orderDetail={orderDetail}
        barcodeData={allBarcode}
        printAllGs1={printAllGs1}
      />
    </>
  );
}
