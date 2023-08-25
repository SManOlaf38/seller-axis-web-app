import { RetailerProvider } from '../../retailers/context';
import { RetailerWarehouseProvider } from '../context';
import NewRetailerWarehouseContainer from './containers';

export default function NewRetailerWarehousePage() {
  return (
    <RetailerWarehouseProvider>
      <RetailerProvider>
        <NewRetailerWarehouseContainer />
      </RetailerProvider>
    </RetailerWarehouseProvider>
  );
}
