'use client';
import JsBarcode from 'jsbarcode';
import { useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Order, OrderPackage } from '../../../interface';
import PrintModalGS1 from './component/ModalGS1';
import PrintModalBarcode from './component/ModalPrintBarcode';
import PrintModalPackingSlip from './component/ModalPrintPackingSlip';
import TableConfirmation from './component/TableConfirmation';

export default function ShipConfirmation({ orderDetail }: { orderDetail: Order }) {
  const [rowToggle, setRowToggle] = useState<number | undefined>(undefined);

  const [isPrintAll, setIsPrintAll] = useState({
    packingSlip: false,
    barcode: false,
    label: false
  });

  const [barcodeData, setBarcodeData] = useState<string[]>([]);
  const [sscc, setSscc] = useState({
    shipToPostBarcode: '',
    forBarcode: '',
    ssccBarcode: ''
  });

  const [print, setPrint] = useState<{
    barcode: string[];
    gs1: OrderPackage | null;
  }>({
    barcode: [],
    gs1: null
  });

  const handleChangeIsPrintAll = (name: 'packingSlip' | 'barcode' | 'label') => {
    setIsPrintAll({
      ...isPrintAll,
      [name]: !isPrintAll[name]
    });
  };

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
    console.log('data', data);

    if (data.label.includes('http')) {
      window.open(data.label, '_blank');
      setPrint(data);
    } else {
      const newWindow = window.open('', '_blank');

      if (newWindow) {
        setPrint(data.label);
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
      setSscc({
        ...sscc,
        shipToPostBarcode: tempShipToBarcode
      });

      if (orderDetail?.ship_to?.partner_person_place_id) {
        JsBarcode(canvas, orderDetail?.ship_to?.partner_person_place_id, {
          displayValue: false
        });
        const tempForBarcode = canvas?.toDataURL();
        setSscc({
          ...sscc,
          forBarcode: tempForBarcode
        });
      }

      if (print?.gs1?.shipment_packages[0]?.sscc) {
        JsBarcode(canvas, print.gs1.shipment_packages[0].sscc, {
          displayValue: false,
          height: 200
        });
        const tempSsccBarcode = canvas.toDataURL();
        setSscc({
          ...sscc,
          ssccBarcode: tempSsccBarcode
        });
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

  const allBarcode = useMemo(() => {
    if (orderDetail.order_packages.length) {
      const combinedArray = orderDetail.order_packages.reduce((result, currentArray) => {
        return result.concat(
          currentArray?.order_item_packages.map(
            (sub: OrderPackage) => sub.retailer_purchase_order_item?.product_alias.upc
          )
        );
      }, []);

      if (combinedArray.length > 0) {
        const barcodeArr: string[] = [];

        combinedArray?.forEach((data) => {
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

        return barcodeArr;
      }

      return [];
    }
  }, [orderDetail.order_packages]);

  return (
    <>
      <CardToggle
        title={
          <div className="flex w-full justify-between">
            <div className="mr-4 flex items-center gap-2">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChangeIsPrintAll('packingSlip');
                }}
              >
                Packing Slip
              </Button>
              {[
                {
                  label: 'Print all barcode',
                  value: 'barcode'
                },
                {
                  label: 'Print all label',
                  value: 'label'
                }
              ].map((item) => (
                <Button
                  key={item.label}
                  color="bg-primary500"
                  className="text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeIsPrintAll(item.value as 'packingSlip' | 'barcode' | 'label');
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

      <PrintModalGS1
        barcodeData={barcodeData}
        open={!!print.gs1?.id}
        onClose={handleCloseModal}
        forBarcode={sscc.forBarcode}
        print={print}
        ssccBarcode={sscc.ssccBarcode}
        orderDetail={orderDetail}
        shipToPostBarcode={sscc.shipToPostBarcode}
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
    </>
  );
}
