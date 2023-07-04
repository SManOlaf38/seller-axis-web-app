import { Suspense } from 'react';

import { OrganizationProvider } from '../context';
import OrganizationContainer from './container';
import Loading from './loading';

export default async function WareHousePage() {
  return (
    <OrganizationProvider>
      <Suspense fallback={<Loading />}>
        <OrganizationContainer />
      </Suspense>
    </OrganizationProvider>
  );
}
