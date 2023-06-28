import { WarehouseProvider } from "./context";
import WarehouseContainer from "./container";

export default function WareHousePage() {
  return (
    <WarehouseProvider>
      <WarehouseContainer />
    </WarehouseProvider>
  );
}
