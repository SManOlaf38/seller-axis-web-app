import ProductContainer from './containers';
import { ProductProvider } from './context';

export default async function Home() {
  return (
    <ProductProvider>
      <ProductContainer />
    </ProductProvider>
  );
}
