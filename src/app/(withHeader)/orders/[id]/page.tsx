import { Suspense } from 'react';

import { OrderProvider } from '../context';
import { getOrderDetailServer } from '../fetch/dataFetch';
import OrderDetailContainer from './containers';
import Loading from './loading';
import { RetailerCarrierProvider } from '../../carriers/context';
import { BoxProvider } from '../../box/context';

export default async function Home({ params }: { params: { id: string } }) {
  const data = await getOrderDetailServer(+params.id);

  return (
    <OrderProvider>
      <BoxProvider>
        <RetailerCarrierProvider>
          <Suspense fallback={<Loading />}>
            <OrderDetailContainer detail={data} />
          </Suspense>
        </RetailerCarrierProvider>
      </BoxProvider>
    </OrderProvider>
  );
}
