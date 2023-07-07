export const headerTable = [
  {
    id: 'sku',
    label: 'SKU'
  },
  {
    id: 'quantity',
    label: 'Quantity'
  },
  {
    id: 'available',
    label: 'Available'
  },
  {
    id: 'vendor_sku',
    label: 'Vendor SKU'
  },
  {
    id: 'merchant_sku',
    label: 'Merchant SKU'
  },
  {
    id: 'merchant',
    label: 'Merchant'
  },
  {
    id: 'warehouse',
    label: 'Warehouse'
  },
  {
    id: 'update_quantity',
    label: 'Update quantity'
  },
  {
    id: 'current_quantity',
    label: 'Current quantity'
  },
  {
    id: 'next_available_date',
    label: 'Next available date'
  }
];

export const tableData = [
  {
    id: '111',
    childSKU: 'TY-9323-fe209-13',
    quantity: {
      onHand: 100,
      pending: 200,
      reserved: 300
    },
    availability: 'Unavailable',
    vendor_sku: 'aloalo',
    merchant_sku: 'ABCD',
    merchantSKU: 'ABCS',
    inventory_warehouse: [
      {
        next_available_date: '2023-05-31T17:00:00',
        next_available_quantity: 111,
        warehouse_id: {
          name: 'Chu đức việt1'
        }
      },
      {
        next_available_date: '2023-05-31T17:00:00',
        next_available_quantity: 111,
        warehouse_id: {
          name: 'Chu đức việt2'
        }
      },
      {
        next_available_date: '2023-05-31T17:00:00',
        next_available_quantity: 111,
        warehouse_id: {
          name: 'Chu đức việt3'
        }
      }
    ]
  },
  {
    id: '1112',
    childSKU: 'TT-9323-fe209-13',
    quantity: {
      onHand: 100,
      pending: 200,
      reserved: 300
    },
    availability: 'Unavailable',
    vendor_sku: 'aloalo',
    merchant_sku: 'ABC',
    merchantSKU: 'ABCS',
    inventory_warehouse: [
      {
        next_available_date: '2023-05-31T17:00:00',
        next_available_quantity: 111,
        warehouse_id: {
          name: 'Chu đức việt1'
        }
      }
    ]
  }
];
