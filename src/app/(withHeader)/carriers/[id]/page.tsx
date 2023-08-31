import { OrderProvider } from '../../orders/context';
import { RetailerProvider } from '../../retailers/context';
import { RetailerCarrierProvider } from '../context';
import RetailerCarrierDetailContainer from './containers';

export default async function NewRetailerCarrierPage({ params }: { params: { id: string } }) {
  return (
    <RetailerCarrierProvider>
      <RetailerProvider>
        <OrderProvider>
          <RetailerCarrierDetailContainer id={params.id} />
        </OrderProvider>
      </RetailerProvider>
    </RetailerCarrierProvider>
  );
}
