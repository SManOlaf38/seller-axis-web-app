import { OrderProvider } from '../context';
import OrderDetailContainer from './containers';

export default async function Home() {
  return (
    <OrderProvider>
      <OrderDetailContainer />
    </OrderProvider>
  );
}
