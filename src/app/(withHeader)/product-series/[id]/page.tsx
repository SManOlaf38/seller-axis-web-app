import { Suspense } from 'react';

import { BoxProvider } from '../../box/context';
import { ProductProvider } from '../../products/context';
import { ProductSeriesProvider } from '../context';
import { getProductSeriesDetailServer } from '../fetch/dataFetch';
import ProductSeriesDetailContainer from './containers';
import Loading from './loading';

export default async function NewProductSeriesPage({ params }: { params: { id: string } }) {
  const data = await getProductSeriesDetailServer(+params.id);

  return (
    <ProductSeriesProvider>
      <ProductProvider>
        <BoxProvider>
          <Suspense fallback={<Loading />}>
            <ProductSeriesDetailContainer detail={data} />
          </Suspense>
        </BoxProvider>
      </ProductProvider>
    </ProductSeriesProvider>
  );
}
