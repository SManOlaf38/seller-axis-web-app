'use client';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react';

import IconPlus from 'public/plus-icon.svg';
import IconRefresh from 'public/refresh.svg';

import { useStore } from '@/app/(withHeader)/orders/context';
import * as actions from '@/app/(withHeader)/orders/context/action';
import * as services from '@/app/(withHeader)/orders/fetch';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import {
  Order,
  OrderItemPackages,
  OrderPackage,
  OrderPackages,
  SaveShipmentDetail,
  ShippingService
} from '@/app/(withHeader)/orders/interface';
import useSelectTable from '@/hooks/useSelectTable';

import { InviteMember } from '../ModalPackage';
import TablePackage from './components/TablePackage';
import ShipmentDetail from './components/ShipmentDetail';
import ModalEditRowPack from './components/ModalEditRowPack';
import { headerTable } from './constants';
import { convertDateToISO8601 } from '@/utils/utils';
import { ORDER_STATUS } from '@/constants';

const Package = ({
  detail,
  itemShippingService,
  setIsCheckDimensions,
  orderPackageNotShip
}: {
  detail: Order;
  itemShippingService: ShippingService | undefined;
  setIsCheckDimensions: Dispatch<SetStateAction<boolean>>;
  orderPackageNotShip: OrderPackage[];
}) => {
  const {
    state: { isLoadingResetPackage, isLoadingSaveShipment },

    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const [isOpenPackage, setIsOpenPackage] = useState(false);
  const [openModalEditPack, setOpenModalEditPack] = useState<boolean>(false);
  const [dataPackRow, setDataPackRow] = useState<OrderPackages>();
  const [errorPackage, setErrorPackage] = useState<boolean>(false);
  const [itemPackageDeleted, setItemPackageDeleted] = useState<OrderItemPackages[]>([]);
  const { selectedItems, onSelectAll, onSelectItem, setSelectedItems } = useSelectTable({
    data: orderPackageNotShip || []
  });

  const totalQuantityOrderPackage = useMemo(() => {
    let totalQuantity = 0;
    orderPackageNotShip?.forEach((orderPackage: any) => {
      orderPackage?.order_item_packages?.forEach((itemPackage: any) => {
        totalQuantity += +itemPackage?.quantity;
      });
    });
    return totalQuantity;
  }, [orderPackageNotShip]);

  const totalQtyOrdered = useMemo(() => {
    const items = detail?.items;
    if (!items) return 0;
    const totalQtyOrdered = items?.reduce((accumulator, item) => {
      return accumulator + (+item?.qty_ordered || 0);
    }, 0);
    return totalQtyOrdered;
  }, [detail?.items]);

  const totalMaxQuantity = useMemo(() => {
    const items = orderPackageNotShip;
    if (!items) return 0;
    const maxTotalQuantity = items?.reduce((accumulator, item) => {
      return accumulator + (+item?.box_max_quantity || 0);
    }, 0);
    return maxTotalQuantity;
  }, [orderPackageNotShip]);

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
      setItemPackageDeleted([]);
      setSelectedItems([]);
      dispatchAlert(
        openAlertMessage({
          message: res?.package_divide_error
            ? res.package_divide_error
            : 'Reset Package Successfully',
          color: res?.package_divide_error ? 'warning' : 'success',
          title: res?.package_divide_error ? 'Warning' : 'Success'
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
        ship_date: convertDateToISO8601(data.ship_date),
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

  const handleDeleteBulkPackage = async (ids: number[]) => {
    const itemDeletedAll = orderPackageNotShip
      ?.filter((item) => selectedItems?.includes(+item?.id))
      ?.flatMap((itemPack) => itemPack?.order_item_packages);
    try {
      dispatch(actions.deleteBulkPackageRequest());
      await services.deleteBulkPackageService(ids);
      dispatch(actions.deleteBulkPackageSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Bulk Package Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      setItemPackageDeleted(itemDeletedAll);
      const dataOrder = await services.getOrderDetailServer(+detail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
    } catch (error: any) {
      dispatch(actions.deleteBulkPackageFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Delete Bulk Package Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  useEffect(() => {
    if (totalQuantityOrderPackage < totalQtyOrdered && detail?.status !== ORDER_STATUS.Shipped) {
      setErrorPackage(true);
    } else {
      setErrorPackage(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(detail?.status), totalQtyOrdered, totalQuantityOrderPackage]);

  return (
    <CardToggle title="Package & Shipment Detail" className="max-h-[550px]">
      <div className="flex justify-between">
        <div className="w-[53%]">
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
              className="bg-primary500 text-white"
              startIcon={<IconPlus />}
            >
              Add new box
            </Button>
          </div>
          <TablePackage
            setItemPackageDeleted={setItemPackageDeleted}
            columns={headerTable}
            loading={false}
            dataPackage={orderPackageNotShip as never}
            handleEditRowPack={handleEditRowPack}
            selectedItems={selectedItems}
            selectAllTable={onSelectAll}
            selectItemTable={onSelectItem}
            handleDeleteBulkItem={handleDeleteBulkPackage}
          />
          {errorPackage && (
            <p className="pt-1 text-sm font-medium text-red">
              The quantity of items in the box is less than the order quantity
            </p>
          )}
        </div>

        <ShipmentDetail
          isLoadingSaveShipment={isLoadingSaveShipment}
          itemShippingService={itemShippingService}
          setIsCheckDimensions={setIsCheckDimensions}
          onSaveShipment={handleSaveShipment}
          orderDetail={detail}
          orderPackageNotShip={orderPackageNotShip}
        />
      </div>
      <InviteMember
        setItemPackageDeleted={setItemPackageDeleted}
        itemPackageDeleted={itemPackageDeleted}
        open={isOpenPackage}
        onModalMenuToggle={handleTogglePackage}
        orderPackageNotShip={orderPackageNotShip}
        orderDetail={detail}
        totalMaxQuantity={totalMaxQuantity}
      />
      <ModalEditRowPack
        setItemPackageDeleted={setItemPackageDeleted}
        itemPackageDeleted={itemPackageDeleted}
        openModalEditPack={openModalEditPack}
        dataPackRow={dataPackRow as OrderPackages}
        handleCloseModalEditPack={handleCloseModalEditPack}
        orderPackageNotShip={orderPackageNotShip}
      />
    </CardToggle>
  );
};

export default Package;
