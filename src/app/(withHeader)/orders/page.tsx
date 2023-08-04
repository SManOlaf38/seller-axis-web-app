import { RetailerCarrierProvider } from '../retailer-carriers/context';
import { ProductAliasProvider } from '../product-aliases/context';
import OrderContainer from './containers';
import { OrderProvider } from './context';

export default async function Home() {
  return (
    <OrderProvider>
      <ProductAliasProvider>
        <RetailerCarrierProvider>
          <OrderContainer />
        </RetailerCarrierProvider>
      </ProductAliasProvider>
    </OrderProvider>
  );
}
