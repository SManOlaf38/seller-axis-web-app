import { useEffect, useMemo, useState } from 'react';

import { useStore } from '@/app/(withHeader)/orders/context';
import * as actions from '@/app/(withHeader)/orders/context/action';
import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Table } from '@/components/ui/Table';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';

import { ItemOrder, Order } from '../../../interface';
import { cancelOrderService, getOrderDetailServer } from '../../../fetch';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { formatString } from '@/utils/utils';
import { ORDER_STATUS } from '@/constants';

export const headerTableCancelOrder = [
  {
    id: 'merchant_sku',
    label: 'Merchant SKU'
  },
  {
    id: 'qty',
    label: 'QTY'
  }
];

export const headerTableCancelOrderInModal = [
  {
    id: 'merchant_sku',
    label: 'Merchant SKU'
  },
  {
    id: 'qty',
    label: 'QTY'
  },
  {
    id: 'cancel_reason',
    label: 'Reason cancel order'
  }
];

const cancelCodes = [
  {
    label: 'Bad sku',
    value: 'bad_sku'
  },
  {
    label: 'Collateral impact',
    value: 'collateral_impact'
  },
  {
    label: 'Merchant request',
    value: 'merchant_request'
  },
  {
    label: 'Invalid item cost',
    value: 'invalid_item_cost'
  },
  {
    label: 'Min order not met',
    value: 'min_order_not_met'
  },
  {
    label: 'Other',
    value: 'other'
  },
  {
    label: 'Out of stock',
    value: 'out_of_stock'
  },
  {
    label: 'Discontinued',
    value: 'discontinued'
  }
];

const CancelOrder = ({
  items,
  detail,
  isHaveWarehouseOfPo
}: {
  items: ItemOrder[];
  detail: Order;
  isHaveWarehouseOfPo: boolean;
}) => {
  const {
    state: { isLoadingCancelOrder },
    dispatch
  } = useStore();

  const { dispatch: dispatchAlert } = useStoreAlert();
  const [dataCancelOrder, setDataCancelOrder] = useState<ItemOrder[]>(items);
  const [isOpenPackage, setIsOpenPackage] = useState(false);

  const isStatusBtnCancelOrder = useMemo(() => {
    return [
      // ORDER_STATUS.Acknowledged,
      ORDER_STATUS.Invoiced,
      ORDER_STATUS.Shipped,
      ORDER_STATUS['Shipment Confirmed'],
      ORDER_STATUS['Invoice Confirmed'],
      ORDER_STATUS.Cancelled,
      ORDER_STATUS['Partly Shipped'],
      ORDER_STATUS['Partly Shipped Confirmed']
    ]?.includes(detail?.status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(detail?.status)]);

  const isCancelButtonDisabled = useMemo(() => {
    return dataCancelOrder.some((item) => item?.cancel_reason === null);
  }, [dataCancelOrder]);

  const handleTogglePackage = () => {
    setIsOpenPackage((isOpenPackage) => !isOpenPackage);
  };

  const handleCancelReasonChange = (selectedItemId: number, selectedCancelReason: string) => {
    const selectedItemIndex = dataCancelOrder.findIndex(
      (item: ItemOrder) => item?.id === selectedItemId
    );

    if (selectedItemIndex !== -1) {
      const newDataCancelOrder = [...dataCancelOrder];
      newDataCancelOrder[selectedItemIndex].cancel_reason = selectedCancelReason;
      setDataCancelOrder(newDataCancelOrder);
    }
  };

  const renderBodyTable = dataCancelOrder?.map((row: any, index: number) => ({
    id: index,
    merchant_sku: row.merchant_sku || '-',
    qty: row.qty_ordered || '-',
    cancel_reason: isOpenPackage ? (
      <Select
        options={cancelCodes}
        value={row?.cancel_reason}
        onChange={(selectedValue: React.ChangeEvent<HTMLSelectElement>) => {
          handleCancelReasonChange(row?.id, selectedValue.target.value);
        }}
      />
    ) : row?.cancel_reason === null ? (
      '-'
    ) : (
      formatString(row?.cancel_reason)
    )
  }));

  const handleCancelOrder = async () => {
    const body = dataCancelOrder?.map((item) => ({
      id_item: +item?.id,
      qty: item?.qty_ordered,
      reason: item?.cancel_reason
    }));
    try {
      dispatch(actions.cancelOrderRequest());
      await cancelOrderService(+detail?.id, body);
      dispatch(actions.cancelOrderSuccess());
      const dataOrder = await getOrderDetailServer(+detail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
      dispatchAlert(
        openAlertMessage({
          message: 'Cancel Order Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleTogglePackage();
    } catch (error: any) {
      dispatch(actions.cancelOrderFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'Cancel Order Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  useEffect(() => {
    if (items.length > 0) setDataCancelOrder(items);
  }, [items]);

  return (
    <CardToggle
      isShowContent={false}
      title="Cancel Order"
      className="grid w-full grid-cols-1 gap-1"
    >
      <Table
        columns={
          detail?.status === 'Cancelled' ? headerTableCancelOrderInModal : headerTableCancelOrder
        }
        loading={false}
        rows={renderBodyTable}
        totalCount={0}
        siblingCount={1}
        onPageChange={() => {}}
        currentPage={10}
        pageSize={10}
        isBorder={false}
      />

      <div className="my-4 flex flex-col items-end">
        <Button
          className="bg-primary500"
          onClick={() => handleTogglePackage()}
          disabled={isStatusBtnCancelOrder || isHaveWarehouseOfPo}
        >
          Cancel Order
        </Button>
      </div>

      <Modal open={isOpenPackage} title={'Cancel order'} onClose={handleTogglePackage}>
        <form className="flex flex-col gap-4" onSubmit={() => {}}>
          <Table
            columns={headerTableCancelOrderInModal}
            loading={false}
            rows={renderBodyTable}
            totalCount={0}
            siblingCount={1}
            onPageChange={() => {}}
            currentPage={10}
            pageSize={10}
          />
          <div className="flex justify-end gap-2">
            <Button
              color="dark:bg-gunmetal bg-buttonLight"
              onClick={handleTogglePackage}
              type="button"
            >
              Abort
            </Button>
            <Button
              color="bg-primary500"
              onClick={handleCancelOrder}
              isLoading={isLoadingCancelOrder}
              disabled={isLoadingCancelOrder || isStatusBtnCancelOrder}
              type="button"
            >
              Submit cancel order
            </Button>
          </div>
        </form>
      </Modal>
    </CardToggle>
  );
};

export default CancelOrder;
