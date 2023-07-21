import ProductSeriesContainer from './containers';
import { ProductSeriesProvider } from './context';

export default async function Home() {
  return (
    <ProductSeriesProvider>
      <ProductSeriesContainer />
    </ProductSeriesProvider>
  );
}
