import { ProductSeriesProvider } from '../../product-series/context';
import { ProductProvider } from '../context';
import NewProductContainer from './containers';

export default function NewProductPage() {
  return (
    <ProductProvider>
      <ProductSeriesProvider>
        <NewProductContainer />
      </ProductSeriesProvider>
    </ProductProvider>
  );
}
