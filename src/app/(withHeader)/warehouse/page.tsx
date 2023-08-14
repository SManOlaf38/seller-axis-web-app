import RetailerWarehouseContainer from './containers';
import { RetailerWarehouseProvider } from './context';

export default async function Home() {
  return (
    <RetailerWarehouseProvider>
      <RetailerWarehouseContainer />
    </RetailerWarehouseProvider>
  );
}
