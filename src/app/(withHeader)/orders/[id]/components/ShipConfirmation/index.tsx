'use client';
import JsBarcode from 'jsbarcode';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Icons from '@/components/Icons';
import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import ModalAllGs1 from './component/ModalAllGs1';
import PrintModalGS1 from './component/ModalGS1';
import PrintModalBarcode from './component/ModalPrintBarcode';
import ModalPrintLabel, { imageUrlToBase64 } from './component/ModalPrintLabel';
import PrintModalPackingSlip from './component/ModalPrintPackingSlip';
import TableConfirmation from './component/TableConfirmation';
import ModalPrintAll from './component/ModalPrintAll';
import { LOWES, VOIDED, resetOrientation } from '@/constants';
import ModalPrintAllLabel from './component/ModalPrintAllLabel';

import type { BarCode, Label, Order, OrderPackage } from '../../../interface';

const DATA_BUTTON_PRINT = [
  {
    label: 'Print all',
    value: 'all'
  },
  {
    label: 'Print all barcodes',
    value: 'barcode'
  },
  {
    label: 'Print all labels',
    value: 'label'
  },
  {
    label: 'Print all GS1s',
    value: 'gs1'
  }
];

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
  const orderPackageShipped = useMemo(
    () => orderDetail?.order_packages?.filter((item) => item?.shipment_packages?.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(orderDetail?.order_packages)]
  );

  const isAllShipStatusVoid = useMemo(() => {
    return orderDetail?.order_packages
      ?.flatMap((item) => item.shipment_packages)
      ?.every((itemPack) => itemPack?.status?.toLowerCase() === VOIDED);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(orderDetail?.order_packages)]);

  const shipPckPrintBarcode = useMemo(() => {
    return orderPackageShipped
      ?.map((order) => ({
        ...order,
        shipment_packages: order?.shipment_packages?.filter(
          (itemPackage) => itemPackage?.status?.toLowerCase() !== VOIDED
        )
      }))
      ?.filter((item) => item?.shipment_packages?.length > 0);
  }, [orderPackageShipped]);

  const [rowToggle, setRowToggle] = useState<number | undefined>(undefined);
  const [barcodeData, setBarcodeData] = useState<BarCode[]>([]);
  const [sscc, setSscc] = useState({
    shipToPostBarcode: '',
    forBarcode: '',
    ssccBarcode: '',
    sscc: ''
  });
  const [print, setPrint] = useState<{
    barcode: BarCode[];
    gs1: string | null;
    label: string;
  }>({
    barcode: [],
    gs1: null,
    label: ''
  });
  const [allLabel, setAllLabel] = useState<Label[]>([]);

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

  const shipmentPackagePrintGs1 = useMemo(() => {
    return orderPackageShipped
      ?.flatMap((item) => item?.shipment_packages)
      ?.filter((itemPack) => itemPack.sscc && itemPack?.status?.toLowerCase() !== VOIDED);
  }, [orderPackageShipped]);

  const shipmentPackagePrintLabel = useMemo(() => {
    return orderPackageShipped
      ?.flatMap((item) => item?.shipment_packages)
      ?.filter((itemPack) => itemPack?.status?.toLowerCase() !== VOIDED);
  }, [orderPackageShipped]);

  useEffect(() => {
    if (orderDetail && orderDetail?.ship_to && print?.gs1) {
      const dataSscc = {
        shipToPostBarcode: '',
        forBarcode: '',
        ssccBarcode: '',
        sscc: print?.gs1
      };
      let canvas;
      canvas = document.createElement('canvas');
      JsBarcode(canvas, orderDetail?.ship_to?.postal_code, {
        displayValue: false
      });
      const tempShipToBarcode = canvas?.toDataURL();

      dataSscc.shipToPostBarcode = tempShipToBarcode;

      if (orderDetail?.ship_to?.partner_person_place_id) {
        JsBarcode(canvas, orderDetail?.ship_to?.partner_person_place_id, {
          displayValue: false
        });
        const tempForBarcode = canvas?.toDataURL();
        dataSscc.forBarcode = tempForBarcode;
      }

      if (print?.gs1) {
        JsBarcode(canvas, print.gs1, {
          displayValue: false,
          ean128: true,
          height: 200
        });
        const tempSsccBarcode = canvas?.toDataURL();
        dataSscc.ssccBarcode = tempSsccBarcode;
      }

      setSscc(dataSscc);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderDetail, print?.gs1]);

  useEffect(() => {
    const barcodeArr: BarCode[] = [];
    print?.barcode?.forEach((data: BarCode) => {
      try {
        const svg: any = document.createElement('svg');

        JsBarcode(svg, data?.upc, {
          format: 'UPC'
        });

        const barcodeData = {
          quantity: data?.quantity,
          sku: data?.sku,
          upc: svg.outerHTML,
        } as never;

        barcodeArr.push(barcodeData);
      } catch (error) {
        console.error(`Error UPC: ${data?.upc}`, error);
      }
    });

    setBarcodeData(barcodeArr as never);
  }, [JSON.stringify(print?.barcode)]);

  const allBarcode = useMemo(() => {
    if (shipPckPrintBarcode?.length) {
      const combinedArray = shipPckPrintBarcode?.reduce((result, currentArray: OrderPackage) => {
        return result.concat(
          currentArray?.order_item_packages?.map((sub: OrderPackage) => ({
            orderId: +currentArray?.id,
            quantity: sub.quantity,
            upc: sub?.retailer_purchase_order_item?.product_alias?.upc,
            sku: sub?.retailer_purchase_order_item?.product_alias?.sku
          }))
        );
      }, []);

      if (combinedArray?.length > 0) {
        const barcodeArr: BarCode[] = [];

        combinedArray?.forEach((data: BarCode) => {
          try {
            const svg: any = document.createElement('svg');

            JsBarcode(svg, data?.upc, {
              format: 'UPC'
            });

            const barcodeData = {
              orderId: data?.orderId,
              sku: data?.sku,
              upc: svg.outerHTML,
              quantity: data?.quantity
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipPckPrintBarcode]);

  const printAllGs1 = useMemo(() => {
    const isCheckGs1 = orderPackageShipped?.some((item) => item?.shipment_packages?.[0]?.sscc);
    if (isCheckGs1) {
      let canvas: HTMLCanvasElement;
      if (orderDetail && orderDetail?.ship_to && orderPackageShipped?.length > 0) {
        const dataSscc: {
          forBarcode: string;
          shipToPostBarcode: string;
          ssccBarcode: {
            tempSsccBarcode: string;
            sscc: string;
          }[];
        } = {
          shipToPostBarcode: '',
          forBarcode: '',
          ssccBarcode: []
        };

        canvas = document.createElement('canvas');
        JsBarcode(canvas, orderDetail?.ship_to?.postal_code, {
          displayValue: false
        });
        const tempShipToBarcode = canvas?.toDataURL();

        dataSscc.shipToPostBarcode = tempShipToBarcode;

        if (orderDetail?.ship_to?.partner_person_place_id) {
          JsBarcode(canvas, orderDetail?.ship_to?.partner_person_place_id, {
            displayValue: false
          });
          const tempForBarcode = canvas?.toDataURL();
          dataSscc.forBarcode = tempForBarcode;
        }

        if (orderPackageShipped?.length > 0) {
          const isSscc = orderPackageShipped?.some((item) => item?.shipment_packages?.[0]?.sscc);

          if (isSscc) {
            const sscc = shipmentPackagePrintGs1?.map((item) => {
              const sscc = item?.sscc;
              const orderId = item?.package;

              JsBarcode(canvas, sscc, {
                displayValue: false,
                height: 200,
                ean128: true
              });
              const tempSsccBarcode = canvas?.toDataURL();
              return {
                tempSsccBarcode,
                sscc,
                orderId
              };
            });

            dataSscc.ssccBarcode = sscc;
          }
        }

        return dataSscc;
      }
    } else {
      return {
        forBarcode: '',
        shipToPostBarcode: '',
        ssccBarcode: []
      };
    }
  }, [orderDetail, orderPackageShipped, shipmentPackagePrintGs1]);

  const isCheckGS1 = useMemo(() => {
    return orderPackageShipped?.some((item) => item?.shipment_packages?.[0]?.sscc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipPckPrintBarcode]);

  const generateNewBase64s = useCallback(async (data: string) => {
    const res = new Promise((res) => {
      resetOrientation(`data:image/gif;base64,${data}`, 6, function (resetBase64Image) {
        res(resetBase64Image);
      });
    });

    const temp = await res;

    return temp;
  }, []);

  useEffect(() => {
    if (shipmentPackagePrintLabel?.length > 0) {
      const promises = shipmentPackagePrintLabel?.map(async (item) => {
        if (item?.package_document.includes('UPS')) {
          const imagePrint = item?.package_document;

          return new Promise(async (resolve) => {
            imageUrlToBase64(imagePrint, async (base64Data) => {
              if (base64Data) {
                const resetBase64Image = await generateNewBase64s(base64Data);
                resolve({ orderId: +item?.package, data: resetBase64Image });
              } else {
                resolve(null);
              }
            });
          });
        } else {
          const labelObject = {
            orderId: +item?.package,
            data: item?.package_document
          };
          return labelObject;
        }
      });

      Promise.all(promises)
        .then((results) => {
          const filteredResults = results.filter((result) => result !== null);
          setAllLabel(filteredResults as Label[]);
        })
        .catch((error) => {
          console.error('Error processing images:', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shipmentPackagePrintLabel]);

  return (
    <>
      <CardToggle
        contentRight={
          <div className="mr-4 flex items-center gap-2">
            {!isAllShipStatusVoid && (
              <>
              {/* {bardcodeSvg && bardcodeSvg} */}
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleChangeIsPrintAll('packingSlip');
                  }}
                  className="bg-gey100 dark:bg-gunmetal"
                >
                  Packing Slip
                </Button>
                {DATA_BUTTON_PRINT.map((item) => {
                  if (item.value === 'gs1' && !isCheckGS1) {
                    return null;
                  }
                  if (
                    item.value === 'gs1' &&
                    orderDetail?.batch?.retailer?.name?.toLowerCase() !== LOWES
                  ) {
                    return null;
                  }
                  return (
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
                  );
                })}
              </>
            )}
          </div>
        }
        iconTitle={<Icons glyph="shipment-confirmation" />}
        title="Shipment Confirmation"
        className="grid w-full grid-cols-1 gap-4"
      >
        <TableConfirmation
          orderDetail={orderDetail}
          rowToggle={rowToggle}
          handleToggleRow={handleToggleRow}
          setPrint={setPrint}
          handleOpenLabel={handleOpenLabel}
          orderPackageShipped={orderPackageShipped}
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

      <ModalPrintAllLabel
        open={isPrintAll.label}
        onClose={() => handleChangeIsPrintAll('label')}
        allLabel={allLabel}
      />

      <PrintModalGS1
        open={!!print.gs1}
        onClose={handleCloseModal}
        forBarcode={sscc.forBarcode}
        ssccBarcode={sscc.ssccBarcode}
        shipToPostBarcode={sscc.shipToPostBarcode}
        orderDetail={orderDetail}
        sscc={sscc.sscc}
        orderPackageShipped={orderPackageShipped}
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

      {isCheckGS1 && (
        <ModalAllGs1
          open={isPrintAll.gs1}
          onClose={() => handleChangeIsPrintAll('gs1')}
          printAllGs1={printAllGs1}
          orderDetail={orderDetail}
          orderPackageShipped={orderPackageShipped}
        />
      )}

      <ModalPrintAll
        open={isPrintAll.all}
        onClose={() => handleChangeIsPrintAll('all')}
        orderDetail={orderDetail}
        barcodeData={allBarcode}
        printAllGs1={printAllGs1}
        allLabel={allLabel}
        orderPackageShipped={orderPackageShipped}
      />
    </>
  );
}
