import NewProductSeriesContainer from '../../create/containers';
import { ProductSeries } from '../../interface';

const ProductSeriesDetailContainer = ({ detail }: { detail: ProductSeries }) => {
  return <NewProductSeriesContainer detail={detail} />;
};

export default ProductSeriesDetailContainer;
