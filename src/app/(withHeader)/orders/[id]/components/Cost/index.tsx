import { useMemo } from 'react';

import CardToggle from '@/components/ui/CardToggle';
import { InfoOrder } from '../InfoOrder';
import { ItemOrder, Order } from '../../../interface';

const Cost = ({ orderDetail }: { orderDetail: Order }) => {
  const totalCost = useMemo(
    () =>
      orderDetail?.items?.reduce(
        (accumulator: number, item: ItemOrder) =>
          accumulator + +item?.qty_ordered * +item?.unit_cost,
        0
      ),
    [orderDetail?.items]
  );
  return (
    <CardToggle title="Cost" className="grid w-full grid-cols-1 gap-1">
      <InfoOrder title={'Product'} value={`$ ${totalCost}` || '-'} />
      <InfoOrder title={'Shipping'} value={'-'} />
      <InfoOrder title={'Tax'} value={'-'} />
      <InfoOrder className="border-none" title={'Total paid'} value={'-'} />
    </CardToggle>
  );
};

export default Cost;
