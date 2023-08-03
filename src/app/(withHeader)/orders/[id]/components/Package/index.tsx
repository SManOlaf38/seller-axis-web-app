'use client';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';

import IconPlus from 'public/plus-icon.svg';
import IconRefresh from 'public/refresh.svg';

import { useStore } from '@/app/(withHeader)/orders/context';
import * as actions from '@/app/(withHeader)/orders/context/action';
import * as services from '@/app/(withHeader)/orders/fetch';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Order, OrderPackages, SaveShipmentDetail } from '@/app/(withHeader)/orders/interface';

import { InviteMember } from '../ModalPackage';
import TablePackage from './components/TablePackage';
import ShipmentDetail from './components/ShipmentDetail';
import ModalEditRowPack from './components/ModalEditRowPack';
import { headerTable } from './constants';

const Package = ({ detail }: { detail: Order }) => {
  const {
    state: { isLoadingResetPackage, isLoadingSaveShipment },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

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
    const items = detail?.items;
    if (!items) return 0;
    const totalQtyOrdered = items?.reduce((accumulator, item) => {
      return accumulator + (+item?.qty_ordered || 0);
    }, 0);
    return totalQtyOrdered;
  }, [detail?.items]);

  const totalMaxQuantity = useMemo(() => {
    const items = detail?.order_packages;
    if (!items) return 0;
    const maxTotalQuantity = items?.reduce((accumulator, item) => {
      return accumulator + (+item?.box_max_quantity || 0);
    }, 0);
    return maxTotalQuantity;
  }, [detail?.order_packages]);

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

  const handlePackageReset = async () => {
    try {
      dispatch(actions.resetPackageRequest());
      const res = await services.resetPackageService(+detail?.id);
      dispatch(actions.resetPackageSuccess());
      dispatch(actions.setOrderDetail(res));
      dispatchAlert(
        openAlertMessage({
          message: 'Reset Package Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.resetPackageFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleSaveShipment = async (data: SaveShipmentDetail) => {
    try {
      dispatch(actions.saveShipmentDetailRequest());
      await services.saveShipmentDetailService({
        ...data,
        ship_date: dayjs(data.ship_date).format('YYYY-MM-DDTHH:mm:ss.000ZZ'),
        id: +detail?.id
      });
      if (data.isEditDimensions) {
        await services.saveOrderPackageDetailService(
          data?.package_data.map((item) => ({
            id: item.id,
            length: item.length,
            width: item.width,
            height: item.height,
            dimension_unit: item.dimension_unit,
            weight: item.weight,
            weight_unit: item.weight_unit
          }))
        );
      }
      const dataOrder = await services.getOrderDetailServer(+detail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
      dispatch(actions.saveShipmentDetailSuccess(data));
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Something went wrong',
          color: 'error',
          title: 'Fail'
        })
      );
      dispatch(actions.saveShipmentDetailFailure(error.message));
    }
  };

  useEffect(() => {
    if (totalQuantityOrderPackage < totalQtyOrdered) {
      setErrorPackage(true);
    } else {
      setErrorPackage(false);
    }
  }, [totalQtyOrdered, totalQuantityOrderPackage]);

  return (
    <CardToggle title="Package & Shipment Detail" className="max-h-[550px]">
      <div className="grid w-full grid-cols-2 justify-between gap-2">
        <div>
          <div className="flex py-4">
            <Button
              isLoading={isLoadingResetPackage}
              disabled={isLoadingResetPackage}
              onClick={handlePackageReset}
              className="mr-4 bg-gey100 dark:bg-gunmetal"
              startIcon={<IconRefresh />}
            >
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
          <TablePackage
            columns={headerTable}
            loading={false}
            dataPackage={detail?.order_packages as never}
            handleEditRowPack={handleEditRowPack}
          />
          {errorPackage && (
            <p className="pt-1 text-sm font-medium text-red">
              The quantity of items in the box is less than the order quantity
            </p>
          )}
        </div>

        <ShipmentDetail
          isLoadingSaveShipment={isLoadingSaveShipment}
          onSaveShipment={handleSaveShipment}
          orderDetail={detail}
        />
      </div>
      <InviteMember
        open={isOpenPackage}
        onModalMenuToggle={handleTogglePackage}
        orderDetail={detail}
        totalMaxQuantity={totalMaxQuantity}
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
