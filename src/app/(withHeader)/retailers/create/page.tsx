import { RetailerCarrierProvider } from '../../retailer-carriers/context';
import { RetailerWarehouseProvider } from '../../warehouse/context';
import { RetailerProvider } from '../context';
import NewRetailerContainer from './containers';

export default function NewRetailerPage() {
  return (
    <RetailerProvider>
      <RetailerWarehouseProvider>
        <RetailerCarrierProvider>
          <NewRetailerContainer />
        </RetailerCarrierProvider>
      </RetailerWarehouseProvider>
    </RetailerProvider>
  );
}
