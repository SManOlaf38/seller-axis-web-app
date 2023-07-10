import OrderContainer from './containers';
import { OrderProvider } from './context';

export default async function Home() {
  return (
    <OrderProvider>
      <OrderContainer />
    </OrderProvider>
  );
}
