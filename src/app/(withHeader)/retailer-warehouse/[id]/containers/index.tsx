import NewRetailerWarehouseContainer from '../../create/containers';
import { RetailerWarehouse } from '../../interface';

const RetailerWarehouseDetailContainer = ({ detail }: { detail: RetailerWarehouse }) => {
  return <NewRetailerWarehouseContainer detail={detail} />;
};

export default RetailerWarehouseDetailContainer;
