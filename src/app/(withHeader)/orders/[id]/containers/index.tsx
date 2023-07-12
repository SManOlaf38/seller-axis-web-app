import clsx from 'clsx';
import ConfigureShipment from '../components/ConfigureShipment';
import Cost from '../components/Cost';
import General from '../components/General';
import OrderItem from '../components/OrderItem';
import Package from '../components/Package';
import Recipient from '../components/Recipient';

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
    id: 'orderItem',
    label: 'Order Item'
  },
  {
    id: 'qty',
    label: 'QTY'
  }
];

const OrderDetailContainer = () => {
  return (
    <main className="relative mb-2">
      <h2 className="my-4 text-lg font-semibold">Purchase Order</h2>
      <div className="h-full">
        <div className="grid w-full grid-cols-3 gap-2">
          <div className="col-span-2 flex flex-col gap-2">
            <Package />
            <Recipient />
            <OrderItem />
          </div>
          <div className="flex flex-col gap-2">
            <General />
            <ConfigureShipment />
            <Cost />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailContainer;
