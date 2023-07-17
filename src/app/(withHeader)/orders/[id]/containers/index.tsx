'use client';

import clsx from 'clsx';
import { useEffect } from 'react';

import { useStore } from '../../context';
import { setOrderDetail } from '../../context/action';
import ConfigureShipment from '../components/ConfigureShipment';
import Cost from '../components/Cost';
import General from '../components/General';
import OrderItem from '../components/OrderItem';
import Package from '../components/Package';
import Recipient from '../components/Recipient';
import { Order, PayloadManualShip } from '../../interface';
import ManualShip from '../components/ManualShip';
import * as actions from '../../context/action';
import SubmitInvoice from '../components/SubmitInvoice';

export const InfoOrder = ({
  title,
  value,
  className
}: {
  title: string | React.ReactNode;
  value: string | number | React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        'grid w-full grid-cols-2 gap-2 border-b border-lightLine py-1 dark:border-iridium',
        className
      )}
    >
      <div className="text-sm font-medium">{title}</div>
      <div className="text-sm font-light">{value}</div>
    </div>
  );
};

export const headerTableWarehouse = [
  {
    id: 'merchant_sku',
    label: 'Merchant SKU'
  },
  {
    id: 'product_alias',
    label: 'Product alias'
  },
  {
    id: 'unit_cost',
    label: 'Unit cost'
  },
  {
    id: 'qty',
    label: 'QTY'
  }
];

const OrderDetailContainer = ({ detail }: { detail: Order }) => {
  const {
    state: { orderDetail, isLoading },
    dispatch
  } = useStore();

  const handleCreateManualShip = async (data: PayloadManualShip) => {
    try {
      dispatch(actions.createManualShipRequest());
      dispatch(actions.createManualShipSuccess(data));
    } catch (error: any) {
      dispatch(actions.createManualShipFailure(error.message));
    }
  };

  const handleSubmitInvoice = async (data: any) => {
    try {
      dispatch(actions.createInvoiceRequest());
      dispatch(actions.createInvoiceSuccess(data));
    } catch (error: any) {
      dispatch(actions.createInvoiceFailure(error.message));
    }
  };

  useEffect(() => {
    dispatch(setOrderDetail(detail));
  }, [detail, dispatch]);

  return (
    <main className="relative mb-2">
      <h2 className="my-4 text-lg font-semibold">Purchase Order: #{orderDetail.po_number}</h2>
      <div className="h-full">
        <div className="grid w-full grid-cols-3 gap-2">
          <div className="col-span-2 flex flex-col gap-2">
            <Package />
            <Recipient
              billTo={orderDetail.bill_to}
              customer={orderDetail.customer}
              shipTo={orderDetail.ship_to}
            />
            <OrderItem items={orderDetail.items} />
          </div>
          <div className="flex flex-col gap-2">
            <General orderDate={orderDetail.order_date} />
            <ConfigureShipment />
            <ManualShip isLoading={isLoading} onCreateManualShip={handleCreateManualShip} />
            <Cost />
            <SubmitInvoice isLoading={isLoading} onSubmitInvoice={handleSubmitInvoice} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailContainer;
