import NewProductAliasContainer from '../../create/containers';
import { ProductAlias } from '../../interface';

const ProductAliasDetailContainer = ({ detail }: { detail: ProductAlias }) => {
  return <NewProductAliasContainer detail={detail} />;
};

export default ProductAliasDetailContainer;
