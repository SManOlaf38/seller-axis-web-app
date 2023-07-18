import { ProductProvider } from '../../products/context';
import { BoxProvider } from '../context';
import NewBoxContainer from './containers';

export default function NewBoxPage() {
  return (
    <ProductProvider>
      <BoxProvider>
        <NewBoxContainer />
      </BoxProvider>
    </ProductProvider>
  );
}
