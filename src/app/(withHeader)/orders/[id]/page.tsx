import { Suspense } from 'react';

import { OrderProvider } from '../context';
import { getOrderDetailServer } from '../fetch/dataFetch';
import OrderDetailContainer from './containers';
import Loading from './loading';

export default async function Home({ params }: { params: { id: string } }) {
  const data = await getOrderDetailServer(params.id);

  return (
    <OrderProvider>
      <Suspense fallback={<Loading />}>
        <OrderDetailContainer detail={data} />
      </Suspense>
    </OrderProvider>
  );
}
