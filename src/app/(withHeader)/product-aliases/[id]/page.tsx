import { Suspense } from 'react';

import { ProductProvider } from '../../products/context';
import { ProductAliasProvider } from '../context';
import { getProductAliasDetailServer } from '../fetch/dataFetch';
import ProductAliasDetailContainer from './containers';
import Loading from './loading';

export default async function NewProductAliasPage({ params }: { params: { id: string } }) {
  const data = await getProductAliasDetailServer(params.id);

  return (
    <ProductAliasProvider>
      <ProductProvider>
        <Suspense fallback={<Loading />}>
          <ProductAliasDetailContainer detail={data} />
        </Suspense>
      </ProductProvider>
    </ProductAliasProvider>
  );
}
