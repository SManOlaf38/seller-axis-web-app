import { ProductProvider } from '../../products/context';
import { RetailerWarehouseProvider } from '../../retailer-warehouse/context';
import { ProductAliasProvider } from '../context';
import NewProductAliasContainer from './containers';

export default function NewProductAliasPage() {
  return (
    <ProductAliasProvider>
      <ProductProvider>
        <RetailerWarehouseProvider>
          <NewProductAliasContainer />
        </RetailerWarehouseProvider>
      </ProductProvider>
    </ProductAliasProvider>
  );
}
