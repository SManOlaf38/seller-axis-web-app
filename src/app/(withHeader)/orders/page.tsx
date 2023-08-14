import { RetailerCarrierProvider } from '../retailer-carriers/context';
import { ProductAliasProvider } from '../product-aliases/context';
import OrderContainer from './containers';
import { OrderProvider } from './context';
import { RetailerProvider } from '../retailers/context';

export default async function Home() {
  return (
    <OrderProvider>
      <RetailerProvider>
        <ProductAliasProvider>
          <RetailerCarrierProvider>
            <OrderContainer />
          </RetailerCarrierProvider>
        </ProductAliasProvider>
      </RetailerProvider>
    </OrderProvider>
  );
}
