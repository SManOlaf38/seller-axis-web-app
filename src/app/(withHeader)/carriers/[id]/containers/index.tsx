import NewRetailerCarrierContainer from '../../create/containers';
import { RetailerCarrier } from '../../interface';

const RetailerCarrierDetailContainer = ({ detail }: { detail: RetailerCarrier }) => {
  return <NewRetailerCarrierContainer detail={detail} />;
};

export default RetailerCarrierDetailContainer;
