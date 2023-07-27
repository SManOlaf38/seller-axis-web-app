'use client';
import { useState } from 'react';

import IconPlus from 'public/plus-icon.svg';
import IconRefresh from 'public/refresh.svg';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import useSelectTable from '@/hooks/useSelectTable';

import { InviteMember } from '../ModalPackage';
import TablePackage from './components/TablePackage';
import ShipmentDetail from './components/ShipmentDetail';
import ModalEditRowPack from './components/ModalEditRowPack';
import { PackageDivide, headerTable } from './constants';
import { Order } from '../../../interface';

// TO-DO
export const data = [
  {
    id: 1,
    box_name: 'A',
    max_qty: 48,
    products: [
      {
        id_product: 1234,
        item: 'Product 1',
        qty: 26
      },
      {
        id_product: 1235,
        item: 'Product 2',
        qty: 20
      },
      {
        id_product: 1236,
        item: 'Product 3',
        qty: 2
      }
    ]
  },
  {
    id: 2,
    max_qty: 18,
    box_name: 'B',
    products: [
      {
        id_product: 123,
        item: 'Product 1',
        qty: 12
      }
    ]
  }
];

const Package = ({ detail }: { detail: Order }) => {
  const { selectedItems, onSelectAll, onSelectItem } = useSelectTable({
    data: data
  });

  const [isOpenPackage, setIsOpenPackage] = useState(false);
  const [dataPackage, setDataPackage] = useState<PackageDivide[]>(data);
  const [openModalEditPack, setOpenModalEditPack] = useState<boolean>(false);
  const [dataPackRow, setDataPackRow] = useState<PackageDivide>();
  const [errorPackage, setErrorPackage] = useState<boolean>(false);

  const handleTogglePackage = () => {
    setIsOpenPackage((isOpenPackage) => !isOpenPackage);
  };

  const handleAddDataPackage = (data: PackageDivide) => {
    setDataPackage([...dataPackage, data]);
  };

  const handleEditRowPack = (row: PackageDivide) => {
    setDataPackRow(row);
    setOpenModalEditPack(true);
  };

  const handleCloseModalEditPack = () => {
    setOpenModalEditPack(false);
  };

  return (
    <CardToggle title="Package & Shipment Detail" className="max-h-[550px]">
      <div className="grid w-full grid-cols-2 justify-between gap-2">
        <div>
          <div className="flex py-4">
            <Button className="mr-4 bg-gey100 dark:bg-gunmetal" startIcon={<IconRefresh />}>
              Reset
            </Button>

            <Button
              onClick={handleTogglePackage}
              className="bg-primary500"
              startIcon={<IconPlus />}
            >
              Add new box
            </Button>
          </div>
          <div className="overflow-y-auto">
            <TablePackage
              columns={headerTable}
              loading={false}
              dataPackage={dataPackage as PackageDivide[]}
              handleEditRowPack={handleEditRowPack}
            />
          </div>
          {errorPackage && (
            <p className="pt-1 text-sm font-medium text-red">
              The quantity of items in the box is less than the order quantity
            </p>
          )}
        </div>

        <div>
          <div className="flex py-4">
            <Button className="bg-primary500">Save</Button>
          </div>
          <ShipmentDetail orderDetail={detail} />
        </div>
      </div>
      <InviteMember
        open={isOpenPackage}
        onAddDataPackage={handleAddDataPackage}
        onModalMenuToggle={handleTogglePackage}
      />
      <ModalEditRowPack
        openModalEditPack={openModalEditPack}
        dataPackRow={dataPackRow}
        handleCloseModalEditPack={handleCloseModalEditPack}
      />
    </CardToggle>
  );
};

export default Package;
