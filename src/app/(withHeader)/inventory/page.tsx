import { ProductAliasProvider } from '../product-aliases/context';
import InventoryContainer from './container';

export default async function Home() {
  return (
    <ProductAliasProvider>
      <InventoryContainer />
    </ProductAliasProvider>
  );
}
