import { Suspense } from 'react';

import { RetailerProvider } from '../../retailers/context';
import { RetailerCarrierProvider } from '../context';
import { getRetailerCarrierDetailServer } from '../fetch/dataFetch';
import RetailerCarrierDetailContainer from './containers';
import Loading from './loading';

export default async function NewRetailerCarrierPage({ params }: { params: { id: string } }) {
  const data = await getRetailerCarrierDetailServer(+params.id);

  return (
    <RetailerCarrierProvider>
      <RetailerProvider>
        <Suspense fallback={<Loading />}>
          <RetailerCarrierDetailContainer detail={data} />
        </Suspense>
      </RetailerProvider>
    </RetailerCarrierProvider>
  );
}
