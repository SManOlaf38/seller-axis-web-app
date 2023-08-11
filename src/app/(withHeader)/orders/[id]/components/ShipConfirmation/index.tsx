import { useState } from 'react';
import clsx from 'clsx';
import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Order, ShipConfirmationType } from '../../../interface';
import ModalPrintLabel from './component/ModalPrintLabel';

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

export default function ShipConfirmation({
  detail,
  orderDetail
}: {
  detail: ShipConfirmationType[];
  orderDetail: Order;
}) {
  const [imagePrint, setImagePrint] = useState<string>('');
  const [modalPrint, setModalPrint] = useState<boolean>(false);
  const [rowToggle, setRowToggle] = useState<number | undefined>(undefined);

  const handleToggleRow = (value: number | undefined) => {
    setRowToggle(value);
  };

  const printBarcode = (item: any) => {};

  const printGS1 = (item: any) => {};

  const printLabel = async (item: string) => {
    setImagePrint(item);
    setModalPrint(true);
  };

  const handleCloseModal = () => {
    setModalPrint(false);
  };

  const renderBodyTable = detail?.map((row, index) => ({
    id: `#${index + 1}`,
    packages: row.package || '-',
    tracking_number:
      (
        <p className="flex items-center justify-center text-dodgeBlue underline">
          {row.tracking_number}
        </p>
      ) || '-',
    shipping_method: orderDetail?.shipping_service || '-',
    prints: (
      <div className="flex items-center justify-between">
        {!row?.package_document && (
          <p className="text-dodgeBlue underline" onClick={() => printBarcode(row)}>
            Barcode
          </p>
        )}
        {!row?.package_document && (
          <p className="text-dodgeBlue underline" onClick={() => printGS1(row)}>
            GS1
          </p>
        )}
        <p className="text-dodgeBlue underline" onClick={() => printLabel(row?.package_document)}>
          Label
        </p>
      </div>
    )
  }));
  const printPackSlip = () => {};

  const printAllBarcodes = () => {};

  const printAllGP1s = () => {};

  const printAllLabels = () => {};

  return (
    <>
      <CardToggle title="Shipment Confirmation" className="grid w-full grid-cols-1 gap-4">
        {detail?.length > 0 && (
          <div className="mb-[16px] flex items-center justify-end">
            <Button className="mr-4 bg-gey100 dark:bg-gunmetal" onClick={printPackSlip}>
              Print Packing slip
            </Button>
            <Button className="mr-4 bg-primary500" onClick={printAllBarcodes}>
              Print all Barcodes
            </Button>
            <Button className="mr-4 bg-primary500" onClick={printAllGP1s}>
              Print all GP1s
            </Button>
            <Button className="bg-primary500" onClick={printAllLabels}>
              Print all labels
            </Button>
          </div>
        )}
        {/* <Table
          columns={headerTableWarehouse}
          loading={false}
          rows={renderBodyTable}
          totalCount={0}
          siblingCount={1}
          onPageChange={() => {}}
          currentPage={10}
          pageSize={10}
          isBorder={false}
        /> */}

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
                            <IconArrowDown className=" w-[12px]" />
                          </Button>
                        ) : (
                          <Button onClick={() => handleToggleRow(index)}>
                            <IconRight className=" w-[12px]" />
                          </Button>
                        )}
                        #{index} {item.package}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                      {item?.box?.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                      {item?.shipment_packages?.map((item: any) => (
                        <div key={item.id}>{item?.tracking_number}</div>
                      ))}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                      -
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-center text-sm font-normal text-lightPrimary dark:text-gey100">
                      <div className="flex items-center justify-between">
                        <Button className="text-dodgeBlue underline">Barcode</Button>
                        <Button className="text-dodgeBlue underline">GS1</Button>
                        <Button className="text-dodgeBlue underline">Label</Button>
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
      <ModalPrintLabel
        imagePrint={imagePrint}
        open={modalPrint}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
