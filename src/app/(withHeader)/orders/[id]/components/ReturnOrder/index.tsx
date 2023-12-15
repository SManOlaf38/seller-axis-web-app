import { Dispatch, SetStateAction, useState } from 'react';
import dayjs from 'dayjs';

import * as actions from '@/app/(withHeader)/orders/context/action';
import * as services from '@/app/(withHeader)/orders/fetch';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/orders/context';
import { Button } from '@/components/ui/Button';
import General from '../General';
import CardToggle from '@/components/ui/CardToggle';
import Autocomplete from '@/components/ui/Autocomplete';
import { Options } from '@/app/(withHeader)/orders/containers';
import SectionOrderReturn from './components/SectionOrderReturn';

import type {
  ListRetailerWarehouse,
  RetailerWarehouse
} from '@/app/(withHeader)/warehouse/interface';
import ModalConfirmReturnOrder from './components/ModalConfirmReturnOrder';
import useToggleModal from '@/hooks/useToggleModal';
import Icons from '@/components/Icons';
import { openAlertMessage } from '@/components/ui/Alert/context/action';

import type { ItemOrder, OrderItemReturn, OrderReturnNote } from '../../../interface';
import { convertDateToISO8601 } from '@/utils/utils';

type ReturnOrder = {
  setIsReturnOrder: Dispatch<SetStateAction<boolean>>;
  dataRetailerWarehouse: ListRetailerWarehouse;
  onGetRetailerWarehouse: () => Promise<void>;
  items: ItemOrder[];
};

export default function ReturnOrder(props: ReturnOrder) {
  const { setIsReturnOrder, dataRetailerWarehouse, items, onGetRetailerWarehouse } = props;
  const {
    state: { orderDetail, isLoadingCreateReturnNote },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const { openModal, handleToggleModal } = useToggleModal();

  const [valueWarehouse, setValueWarehouse] = useState<{
    warehouse: Options | null;
  }>({
    warehouse: null
  });
  const [isDispute, setIsDispute] = useState<boolean>(false);
  const [dateDispute, setDateDispute] = useState(dayjs(new Date()).format('YYYY-MM-DD'));
  const [listReturnNote, setListReturnNote] = useState<OrderReturnNote[]>([]);
  const [itemsOrderReturn, setItemsOrderReturn] = useState<OrderItemReturn[]>([]);
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [isErrorWarehouse, setIsWarehouse] = useState<boolean>(false);

  const handleChangeWarehouse = (value: Options) => {
    setIsWarehouse(false);
    setValueWarehouse({
      warehouse: value
    });
  };

  const onCancelReturnOrder = () => {
    setIsReturnOrder(false);
    setIsErrorMessage(false);
  };

  const onOpenModalConfirm = () => {
    const checkDamageQty = itemsOrderReturn.some((item) => item.damaged > item.return_qty);
    const allReturnQtyZero = itemsOrderReturn.every((item) => item.return_qty === 0);

    if (checkDamageQty || allReturnQtyZero) {
      setIsErrorMessage(true);
    } else {
      setIsErrorMessage(false);
    }

    if (!valueWarehouse.warehouse) {
      setIsWarehouse(true);
    } else {
      setIsErrorMessage(false);
      handleToggleModal();
    }
  };

  const onConfirmReturnOrder = async () => {
    const body = {
      notes: listReturnNote?.map((item) => ({ details: item?.details })),
      order_returns_items: itemsOrderReturn?.map((item) => ({
        reason: item?.reason,
        return_qty: item?.return_qty,
        damaged_qty: item?.damaged || 0,
        item: item?.id
      })),
      order: orderDetail?.id,
      is_dispute: isDispute,
      dispute_date: isDispute ? convertDateToISO8601(dateDispute) : null,
      warehouse: valueWarehouse.warehouse?.value
    };

    try {
      dispatch(actions.createReturnNoteRequest());
      await services.createReturnNoteService(body as never);
      dispatch(actions.createReturnNoteSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Create Return Note Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      const dataOrder = await services.getOrderDetailServer(+orderDetail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
      setIsReturnOrder(false);
    } catch (error: any) {
      dispatch(actions.createReturnNoteFailure());
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Create Return Note Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="my-4 text-lg font-semibold">Purchase Order: #{orderDetail.po_number}</h2>
      </div>
      <div className="h-full">
        <div className="grid w-full grid-cols-3 gap-2">
          <div className="col-span-2 flex flex-col gap-2">
            <SectionOrderReturn
              items={items}
              isDispute={isDispute}
              setIsDispute={setIsDispute}
              listReturnNote={listReturnNote}
              setListReturnNote={setListReturnNote}
              itemsOrderReturn={itemsOrderReturn}
              setItemsOrderReturn={setItemsOrderReturn}
              dateDispute={dateDispute}
              setDateDispute={setDateDispute}
            />
          </div>
          <div className="flex flex-col gap-2">
            <General detail={orderDetail} orderDate={orderDetail.order_date} />
            <CardToggle
              iconTitle={<Icons glyph="intersect" />}
              title="Configure Return Shipment"
              className="grid w-full grid-cols-1 gap-2"
            >
              <Autocomplete
                options={
                  dataRetailerWarehouse?.results?.map((item: RetailerWarehouse) => ({
                    value: item?.id,
                    label: item?.name
                  })) || []
                }
                required
                label="Return to"
                name="warehouse"
                placeholder="Select Retailer Warehouse"
                value={valueWarehouse.warehouse}
                pathRedirect="/warehouse/create"
                onReload={onGetRetailerWarehouse}
                onChange={(value: Options) => handleChangeWarehouse(value)}
                error={isErrorWarehouse && 'Warehouse is required'}
              />
            </CardToggle>
            {isErrorMessage && (
              <span className="text-sm font-medium text-red">
                The damaged amount is invalid, please check again
              </span>
            )}
            <div className="flex items-center justify-end gap-2">
              <Button className="bg-gey100 dark:bg-gunmetal" onClick={onCancelReturnOrder}>
                Cancel
              </Button>
              <Button className="bg-primary500 text-white" onClick={onOpenModalConfirm}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ModalConfirmReturnOrder
        open={openModal}
        onModalToggle={handleToggleModal}
        onConfirmReturnOrder={onConfirmReturnOrder}
        isLoadingCreateReturnNote={isLoadingCreateReturnNote}
      />
    </>
  );
}
