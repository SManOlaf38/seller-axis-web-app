export type Inventory = {
  id: number;
  isUseLiveQty: boolean;
  childSKU: string;
  quantity: {
    onHand: number;
    pending: number;
    reserved: number;
  };
  availability: string;
  vendor_sku: string;
  merchant_sku: string;
  merchantSKU: string;
  inventory_warehouse: [
    {
      current_quantity: number;
      next_available_date: string;
      next_available_quantity: number;
      live_quantity: number;
      warehouse_id: {
        name: string;
      };
    }
  ];
};
