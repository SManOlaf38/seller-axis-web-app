import ProductAliasContainer from './containers';
import { ProductAliasProvider } from './context';

export default async function Home() {
  return (
    <ProductAliasProvider>
      <ProductAliasContainer />
    </ProductAliasProvider>
  );
}
