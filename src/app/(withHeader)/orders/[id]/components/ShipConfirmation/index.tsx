import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Table } from '@/components/ui/Table';
import { Order, ShipConfirmationType } from '../../../interface';
import ModalPrintLabel from './component/ModalPrintLabel';

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
        <Table
          columns={headerTableWarehouse}
          loading={false}
          rows={renderBodyTable}
          totalCount={0}
          siblingCount={1}
          onPageChange={() => {}}
          currentPage={10}
          pageSize={10}
          isBorder={false}
        />
      </CardToggle>
      <ModalPrintLabel
        imagePrint={imagePrint}
        open={modalPrint}
        handleCloseModal={handleCloseModal}
      />
    </>
  );
}
