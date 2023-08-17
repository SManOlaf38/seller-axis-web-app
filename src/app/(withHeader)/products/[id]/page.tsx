import { Suspense } from 'react';

import { ProductProvider } from '../context';
import ProductDetailContainer from './containers';
import Loading from './loading';
import { PackageRuleProvider } from '../../package-rules/context';
import { ProductSeriesProvider } from '../../product-series/context';

export default async function Home() {
  return (
    <ProductProvider>
      <ProductSeriesProvider>
        <PackageRuleProvider>
          <Suspense fallback={<Loading />}>
            <ProductDetailContainer />
          </Suspense>
        </PackageRuleProvider>
      </ProductSeriesProvider>
    </ProductProvider>
  );
}
