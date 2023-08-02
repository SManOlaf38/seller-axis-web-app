import { Suspense } from 'react';

import { ProductProvider } from '../../products/context';
import { SFTPProvider } from '../context';
import { getSFTPDetailServer } from '../fetch/dataFetch';
import SFTPDetailContainer from './containers';
import Loading from './loading';

export default async function NewSFTPPage({ params }: { params: { id: string } }) {
  const data = await getSFTPDetailServer(+params.id);

  return (
    <SFTPProvider>
      <ProductProvider>
        <Suspense fallback={<Loading />}>
          <SFTPDetailContainer detail={data} />
        </Suspense>
      </ProductProvider>
    </SFTPProvider>
  );
}
