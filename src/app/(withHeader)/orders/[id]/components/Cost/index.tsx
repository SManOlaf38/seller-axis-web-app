import CardToggle from '@/components/ui/CardToggle';
import { InfoOrder } from '../InfoOrder';

const Cost = () => {
  return (
    <CardToggle title="Cost" className="grid w-full grid-cols-1 gap-1">
      <InfoOrder title={'Product'} value={'-'} />
      <InfoOrder title={'Shipping'} value={'-'} />
      <InfoOrder title={'Tax'} value={'-'} />
      <InfoOrder className="border-none" title={'Total paid'} value={'-'} />
    </CardToggle>
  );
};

export default Cost;
