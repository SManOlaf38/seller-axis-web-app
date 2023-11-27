import { useMemo } from 'react';

import CardToggle from '@/components/ui/CardToggle';
import { InfoOrder } from '../InfoOrder';
import { ItemOrder, Order } from '../../../interface';

const Cost = ({ orderDetail }: { orderDetail: Order }) => {
  const totalCost = useMemo(
    () =>
      orderDetail?.items?.reduce(
        (accumulator: number, item: ItemOrder) =>
          accumulator + +item?.ship_qty_ordered || 0 * +item?.unit_cost,
        0
      ),
    [orderDetail?.items]
  );

  const totalShipping = useMemo(
    () =>
      orderDetail?.items?.reduce(
        (accumulator: number, item: ItemOrder) => accumulator + item?.shipping || 0,
        0
      ),
    [orderDetail?.items]
  );

  const totalTax = useMemo(
    () =>
      orderDetail?.items?.reduce(
        (accumulator: number, item: ItemOrder) => accumulator + item?.tax || 0,
        0
      ),
    [orderDetail?.items]
  );

  return (
    <CardToggle title="Cost" className="grid w-full grid-cols-1 gap-1">
      <InfoOrder title={'Product'} value={`$ ${totalCost.toFixed(2)}` || '-'} />
      <InfoOrder title={'Shipping'} value={'-'} />
      <InfoOrder title={'Tax'} value={'-'} />
      <InfoOrder
        className="border-none"
        title={'Total paid'}
        value={`$ ${(totalCost + totalShipping + totalTax).toFixed(2)}` || '-'}
      />
    </CardToggle>
  );
};

export default Cost;
