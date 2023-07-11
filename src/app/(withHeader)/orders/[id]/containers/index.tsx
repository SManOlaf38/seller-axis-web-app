import { Card } from '@/components/ui/Card';
import clsx from 'clsx';
import GeneralOrder from '../components/GeneralOrder';
import ConfigureShipment from '../components/ConfigureShipment';
import Package from '../components/Package';

export const InfoOrder = ({
  title,
  value,
  className
}: {
  title: string;
  value: string | number | React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={clsx('grid w-full grid-cols-2 gap-2 border-b dark:border-iridium border-lightLine py-1', className)}>
      <div className="text-sm font-medium">{title}</div>
      <div className="text-sm font-light">{value}</div>
    </div>
  );
};

export const headerTableWarehouse = [
  {
    id: 'orderItem',
    label: 'Order Item'
  },
  {
    id: 'uniCost',
    label: 'Uni Cost'
  },
  {
    id: 'qty',
    label: 'QTY'
  },
  {
    id: 'total',
    label: 'Total'
  }
];

const OrderDetailContainer = () => {
  return (
    <main className="relative mb-2">
      <h2 className="my-4 text-lg font-semibold">Purchase Order</h2>
      <div className="h-full">
        <div className="flex items-start gap-2">
          <GeneralOrder />
          <div className="grid w-full grid-cols-1 gap-2">
            <Package />
            <ConfigureShipment />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailContainer;
