import { OrderProvider } from '../../orders/context';
import { RetailerProvider } from '../../retailers/context';
import { RetailerCarrierProvider } from '../context';
import NewRetailerCarrierContainer from './containers';

export default function NewRetailerCarrierPage() {
  return (
    <RetailerCarrierProvider>
      <RetailerProvider>
        <OrderProvider>
          <NewRetailerCarrierContainer />
        </OrderProvider>
      </RetailerProvider>
    </RetailerCarrierProvider>
  );
}
