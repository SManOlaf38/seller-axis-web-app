import { Suspense } from 'react';

import { ProductProvider } from '../context';
import { getProductDetailServer } from '../fetch/dataFetch';
import ProductDetailContainer from './containers';
import Loading from './loading';
import { PackageRuleProvider } from '../../package-rules/context';
import { ProductSeriesProvider } from '../../product-series/context';

export default async function Home({ params }: { params: { id: string } }) {
  const data = await getProductDetailServer(params.id);

  return (
    <ProductProvider>
      <ProductSeriesProvider>
        <PackageRuleProvider>
          <Suspense fallback={<Loading />}>
            <ProductDetailContainer detail={data} />
          </Suspense>
        </PackageRuleProvider>
      </ProductSeriesProvider>
    </ProductProvider>
  );
}
