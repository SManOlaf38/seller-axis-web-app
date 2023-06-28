import { Suspense } from 'react';
import { DetailContainer } from './containers';

// Call API ServerSide
function getPurchaseOrderDetailServer(params: string) {
  return params
}


export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const data = await getPurchaseOrderDetailServer(params.id);

  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <DetailContainer detail={data} />
    </Suspense>
  );
}
