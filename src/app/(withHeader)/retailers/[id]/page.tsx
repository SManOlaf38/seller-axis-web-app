import { RetailerCarrierProvider } from '../../carriers/context';
import { Gs1Provider } from '../../gs1/context';
import { RetailerWarehouseProvider } from '../../warehouse/context';
import { RetailerProvider } from '../context';
import NewRetailerContainer from '../create/containers';

export default function NewRetailerPage() {
  return (
    <RetailerProvider>
      <RetailerWarehouseProvider>
        <RetailerCarrierProvider>
          <Gs1Provider>
            <NewRetailerContainer />
          </Gs1Provider>
        </RetailerCarrierProvider>
      </RetailerWarehouseProvider>
    </RetailerProvider>
  );
}
