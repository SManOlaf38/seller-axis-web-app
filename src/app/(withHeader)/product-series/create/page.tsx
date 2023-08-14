import { ProductProvider } from '../../products/context';
import { RetailerWarehouseProvider } from '../../warehouse/context';
import { ProductSeriesProvider } from '../context';
import NewProductSeriesContainer from './containers';

export default function NewProductSeriesPage() {
  return (
    <ProductSeriesProvider>
      <ProductProvider>
        <RetailerWarehouseProvider>
          <NewProductSeriesContainer />
        </RetailerWarehouseProvider>
      </ProductProvider>
    </ProductSeriesProvider>
  );
}
