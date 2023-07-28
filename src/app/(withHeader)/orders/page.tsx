import { RetailerCarrierProvider } from '../retailer-carriers/context';
import OrderContainer from './containers';
import { OrderProvider } from './context';

export default async function Home() {
  return (
    <OrderProvider>
      <RetailerCarrierProvider>
        <OrderContainer />
      </RetailerCarrierProvider>
    </OrderProvider>
  );
}
