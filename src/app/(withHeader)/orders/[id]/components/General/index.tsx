import CardToggle from '@/components/ui/CardToggle';
import { InfoOrder } from '../../containers';
import dayjs from 'dayjs';

const General = ({ orderDate }: { orderDate: string }) => {
  return (
    <CardToggle title="General" className="grid w-full grid-cols-1">
      <InfoOrder title={'Order Date'} value={dayjs(orderDate).format('YYYY-MM-DD')} />
      <InfoOrder title={'Paid Date'} value={'-'} />
      <InfoOrder title={'Ship By'} value={'-'} />
      <InfoOrder className="border-none" title={'Hold Until'} value={'-'} />
    </CardToggle>
  );
};

export default General;
