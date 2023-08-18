import { Suspense } from 'react';
import { cookies } from 'next/headers';

import { OrderProvider } from '../context';
import { getOrderDetailServer } from '../fetch/dataFetch';
import OrderDetailContainer from './containers';
import Loading from './loading';
import { RetailerCarrierProvider } from '../../carriers/context';
import { BoxProvider } from '../../box/context';
import { RetailerWarehouseProvider } from '../../warehouse/context';

export default async function Home({ params }: { params: { id: string } }) {
  const data = await getOrderDetailServer(+params.id);
  const cookieStore = cookies();
  const access_token_invoice = cookieStore.get('access_token_invoice');
  const refresh_token_invoice = cookieStore.get('refresh_token_invoice');

  return (
    <OrderProvider>
      <BoxProvider>
        <RetailerCarrierProvider>
          <RetailerWarehouseProvider>
            <Suspense fallback={<Loading />}>
              <OrderDetailContainer
                detail={data}
                access_token_invoice={access_token_invoice?.value}
                refresh_token_invoice={refresh_token_invoice?.value}
              />
            </Suspense>
          </RetailerWarehouseProvider>
        </RetailerCarrierProvider>
      </BoxProvider>
    </OrderProvider>
  );
}
