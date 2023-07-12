import CardToggle from '@/components/ui/CardToggle';
import { InfoOrder } from '../../containers';

const Cost = () => {
  return (
    <CardToggle title="Cost" className="grid w-full grid-cols-1 gap-1">
      <InfoOrder title={'Product'} value={`$ ${140} `} />
      <InfoOrder title={'Shipping'} value={`$ ${140} `} />
      <InfoOrder title={'Tax'} value={`$ ${140} `} />
      <InfoOrder className="border-none" title={'Total paid'} value={`$ ${140} `} />
    </CardToggle>
  );
};

export default Cost;
