import { Suspense } from 'react';

import { ProductProvider } from '../context';
import { getProductDetailServer } from '../fetch/dataFetch';
import ProductDetailContainer from './containers';
import Loading from './loading';

export default async function Home({ params }: { params: { id: string } }) {
  const data = await getProductDetailServer(params.id);

  return (
    <ProductProvider>
      <Suspense fallback={<Loading />}>
        <ProductDetailContainer detail={data} />
      </Suspense>
    </ProductProvider>
  );
}
