import { OrderProvider } from '../orders/context';
import InvoicesContainer from './containers';

export default async function Home() {
  return (
    <OrderProvider>
      <InvoicesContainer />
    </OrderProvider>
  );
}
