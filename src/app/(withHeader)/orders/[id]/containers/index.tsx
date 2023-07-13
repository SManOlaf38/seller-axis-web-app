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
import { Order } from '../../interface';

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
    state: { orderDetail },
    dispatch
  } = useStore();

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
            <Recipient customer={orderDetail.customer} shipTo={orderDetail.ship_to} />
            <OrderItem items={orderDetail.items} />
          </div>
          <div className="flex flex-col gap-2">
            <General orderDate={orderDetail.order_date} />
            <ConfigureShipment />
            <Cost />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailContainer;
