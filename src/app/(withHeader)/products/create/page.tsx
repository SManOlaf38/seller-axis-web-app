import { ProductProvider } from '../context';
import NewProductContainer from './containers';

export default function NewProductPage() {
  return (
    <ProductProvider>
      <NewProductContainer />
    </ProductProvider>
  );
}
