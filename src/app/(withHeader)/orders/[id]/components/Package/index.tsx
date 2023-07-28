'use client';
import { useEffect, useMemo, useState } from 'react';

import IconPlus from 'public/plus-icon.svg';
import IconRefresh from 'public/refresh.svg';

import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';

import { InviteMember } from '../ModalPackage';
import TablePackage from './components/TablePackage';
import ShipmentDetail from './components/ShipmentDetail';
import ModalEditRowPack from './components/ModalEditRowPack';
import { headerTable } from './constants';
import { Order, OrderPackages } from '../../../interface';

const Package = ({ detail }: { detail: Order }) => {
  const [isOpenPackage, setIsOpenPackage] = useState(false);
  const [openModalEditPack, setOpenModalEditPack] = useState<boolean>(false);
  const [dataPackRow, setDataPackRow] = useState<OrderPackages>();
  const [errorPackage, setErrorPackage] = useState<boolean>(false);

  const totalQuantityOrderPackage = useMemo(() => {
    let totalQuantity = 0;
    detail?.order_packages?.forEach((orderPackage: any) => {
      orderPackage?.order_item_packages?.forEach((itemPackage: any) => {
        totalQuantity += +itemPackage?.quantity;
      });
    });
    return totalQuantity;
  }, [detail?.order_packages]);

  const totalQtyOrdered = useMemo(() => {
    let totalQtyOrdered = 0;
    detail?.items?.forEach((item: any) => {
      totalQtyOrdered += +item?.qty_ordered;
    });
    return totalQtyOrdered;
  }, [detail?.items]);

  const handleTogglePackage = () => {
    setIsOpenPackage((isOpenPackage) => !isOpenPackage);
  };

  const handleEditRowPack = (row: OrderPackages) => {
    setDataPackRow(row);
    setOpenModalEditPack(true);
  };

  const handleCloseModalEditPack = () => {
    setOpenModalEditPack(false);
  };

  useEffect(() => {
    if (totalQuantityOrderPackage < totalQtyOrdered) {
      setErrorPackage(true);
    }
  }, [totalQtyOrdered, totalQuantityOrderPackage]);

  return (
    <CardToggle title="Package & Shipment Detail" className="max-h-[550px]">
      <div className="grid w-full grid-cols-2 justify-between gap-2">
        <div>
          <div className="flex py-4">
            <Button className="mr-4 bg-gey100 dark:bg-gunmetal" startIcon={<IconRefresh />}>
              Reset
            </Button>

            <Button
              disabled={totalQuantityOrderPackage >= totalQtyOrdered}
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
              dataPackage={detail?.order_packages as never}
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
        onModalMenuToggle={handleTogglePackage}
        orderDetail={detail}
      />
      <ModalEditRowPack
        openModalEditPack={openModalEditPack}
        dataPackRow={dataPackRow as OrderPackages}
        handleCloseModalEditPack={handleCloseModalEditPack}
      />
    </CardToggle>
  );
};

export default Package;
