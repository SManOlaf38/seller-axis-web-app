import { RetailerProvider } from '../retailers/context';
import ProductAliasContainer from './containers';
import { ProductAliasProvider } from './context';

export default async function Home() {
  return (
    <ProductAliasProvider>
      <RetailerProvider>
        <ProductAliasContainer />
      </RetailerProvider>
    </ProductAliasProvider>
  );
}
