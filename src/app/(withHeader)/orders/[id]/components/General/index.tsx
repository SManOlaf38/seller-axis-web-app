import dayjs from 'dayjs';

import CardToggle from '@/components/ui/CardToggle';
import { Order } from '../../../interface';
import { InfoOrder } from '../InfoOrder';

const General = ({ orderDate, detail }: { orderDate: string; detail: Order }) => {
  return (
    <CardToggle title="General" className="grid w-full grid-cols-1">
      <InfoOrder title={'Retailer'} value={detail?.batch?.retailer?.name || '-'} />
      <InfoOrder title={'Order Status'} value={detail?.status || '-'} />
      <InfoOrder title={'Order Date'} value={dayjs(orderDate).format('MM/DD/YYYY')} />
      <InfoOrder title={'Paid Date'} value={'-'} />
      <InfoOrder title={'Ship By'} value={'-'} />
      <InfoOrder className="border-none" title={'Hold Until'} value={'-'} />
    </CardToggle>
  );
};

export default General;
