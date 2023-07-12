import CardToggle from '@/components/ui/CardToggle';
import { InfoOrder } from '../../containers';
import dayjs from 'dayjs';

const General = () => {
  return (
    <CardToggle title="General" className="grid w-full grid-cols-1">
      <InfoOrder title={'Order Date'} value={dayjs(new Date()).format('YYYY-MM-DD')} />
      <InfoOrder title={'Paid Date'} value={dayjs(new Date()).format('YYYY-MM-DD')} />
      <InfoOrder title={'Ship By'} value={dayjs(new Date()).format('YYYY-MM-DD')} />
      <InfoOrder
        className="border-none"
        title={'Hold Until'}
        value={dayjs(new Date()).format('YYYY-MM-DD')}
      />
    </CardToggle>
  );
};

export default General;
