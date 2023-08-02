import { Suspense } from 'react';

import { RetailerProvider } from '../../retailers/context';
import { RetailerWarehouseProvider } from '../context';
import { getRetailerWarehouseDetailServer } from '../fetch/dataFetch';
import RetailerWarehouseDetailContainer from './containers';
import Loading from './loading';

export default async function NewRetailerWarehousePage({ params }: { params: { id: string } }) {
  const data = await getRetailerWarehouseDetailServer(+params.id);

  return (
    <RetailerWarehouseProvider>
      <RetailerProvider>
        <Suspense fallback={<Loading />}>
          <RetailerWarehouseDetailContainer detail={data} />
        </Suspense>
      </RetailerProvider>
    </RetailerWarehouseProvider>
  );
}
