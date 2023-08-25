import { Suspense } from 'react';

import { OrderProvider } from '../context';
import { getOrderDetailServer } from '../fetch/dataFetch';
import OrderDetailContainer from './containers';
import Loading from './loading';
import { RetailerCarrierProvider } from '../../carriers/context';
import { BoxProvider } from '../../box/context';
import { RetailerWarehouseProvider } from '../../warehouse/context';
import { Gs1Provider } from '../../gs1/context';

export default async function Home({ params }: { params: { id: string } }) {
  const data = await getOrderDetailServer(+params.id);

  return (
    <OrderProvider>
      <BoxProvider>
        <RetailerCarrierProvider>
          <RetailerWarehouseProvider>
            <Gs1Provider>
              <Suspense fallback={<Loading />}>
                <OrderDetailContainer detail={data} />
              </Suspense>
            </Gs1Provider>
          </RetailerWarehouseProvider>
        </RetailerCarrierProvider>
      </BoxProvider>
    </OrderProvider>
  );
}
