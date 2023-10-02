import { cookies } from 'next/headers';

import { OrderProvider } from '../orders/context';
import InvoicesContainer from './containers';

export default async function Home() {
  const cookieStore = cookies();
  const refresh_token_invoice = cookieStore.get('refresh_token_invoice');

  return (
    <OrderProvider>
      <InvoicesContainer refresh_token_invoice={refresh_token_invoice?.value} />
    </OrderProvider>
  );
}
