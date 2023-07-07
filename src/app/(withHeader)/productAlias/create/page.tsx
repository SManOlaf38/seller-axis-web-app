import { ProductProvider } from '../../products/context';
import { ProductAliasProvider } from '../context';
import NewProductAliasContainer from './containers';

export default function NewProductAliasPage() {
  return (
    <ProductAliasProvider>
      <ProductProvider>
        <NewProductAliasContainer />
      </ProductProvider>
    </ProductAliasProvider>
  );
}
