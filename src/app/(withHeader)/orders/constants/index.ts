import { object, string } from 'yup';

export const headerTable = [
  {
    id: 'po_number',
    label: 'PO number'
  },
  {
    id: 'customer',
    label: 'Customer'
  },
  {
    id: 'cust_order_number',
    label: 'Customer order number'
  },
  {
    id: 'retailer',
    label: 'Retailer'
  },
  {
    id: 'status',
    label: 'Status'
  },
  {
    id: 'order_date',
    label: 'Order date'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

export const filterStatus = [
  {
    label: 'Opened',
    value: 'Opened'
  },
  {
    label: 'Delivered',
    value: 'Delivered'
  },
  {
    label: 'Confirmed',
    value: 'Confirmed'
  },
  {
    label: 'Acknowledged',
    value: 'Acknowledged'
  },
  {
    label: 'Shipping',
    value: 'Shipping'
  },
  {
    label: 'Shipped',
    value: 'Shipped'
  },
  {
    label: 'Cancelled',
    value: 'Cancelled'
  },
  {
    label: 'Cancelling',
    value: 'Cancelling'
  },
  {
    label: 'Invoiced',
    value: 'Invoiced'
  },
  {
    label: 'Closed',
    value: 'Closed'
  }
];

export const schemaSubmitInvoice = object().shape({
  invoice_number: string().required('Invoice number is required')
});

export type CreateBoxPackageType = {
  box: number;
  order_item: number;
  quantity: number;
};

export const headerTableWarehouse = [
  {
    id: 'merchant_sku',
    label: 'Merchant SKU'
  },
  {
    id: 'product_alias',
    label: 'Product alias'
  },
  {
    id: 'unit_cost',
    label: 'Unit cost'
  },
  {
    id: 'qty',
    label: 'QTY'
  }
];
