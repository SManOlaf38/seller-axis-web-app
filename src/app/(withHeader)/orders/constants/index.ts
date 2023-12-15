import { phoneRegExp } from '@/constants';
import { object, string } from 'yup';
import * as yup from 'yup';

export const headerTable = [
  {
    id: 'po_number',
    label: 'PO number',
    dataField: 'po_number'
  },
  {
    id: 'customer',
    label: 'Customer',
    dataField: 'customer__name'
  },
  {
    id: 'cust_order_number',
    label: 'Customer order number',
    dataField: 'cust_order_number'
  },
  {
    id: 'retailer',
    label: 'Retailer',
    dataField: 'batch__retailer__name'
  },
  {
    id: 'verify_address',
    label: 'Verify Address',
    dataField: 'verified_ship_to__status'
  },
  {
    id: 'status',
    label: 'Status',
    dataField: 'status'
  },
  {
    id: 'order_date',
    label: 'Order date',
    dataField: 'order_date'
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
    label: 'Acknowledged',
    value: 'Acknowledged'
  },
  {
    label: 'Backorder',
    value: 'Backorder'
  },
  {
    label: 'Shipped',
    value: 'Shipped'
  },
  {
    label: 'Shipment Confirmed',
    value: 'Shipment Confirmed'
  },
  {
    label: 'Returned',
    value: 'Returned'
  },
  {
    label: 'Partly Shipped',
    value: 'Partly Shipped'
  },
  {
    label: 'Partly Shipped Confirmed',
    value: 'Partly Shipped Confirmed'
  },
  {
    label: 'Invoiced',
    value: 'Invoiced'
  },
  {
    label: 'Invoice Confirmed',
    value: 'Invoice Confirmed'
  },
  {
    label: 'Cancelled',
    value: 'Cancelled'
  }
];

export const filterStatusDailyPickList = [
  {
    label: 'All',
    value: 'all'
  },
  {
    label: 'Opened',
    value: 'Opened'
  },
  {
    label: 'Acknowledged',
    value: 'Acknowledged'
  },
  {
    label: 'Shipped',
    value: 'Shipped'
  },
  {
    label: 'Shipment Confirmed',
    value: 'Shipment Confirmed'
  },
  {
    label: 'Invoiced',
    value: 'Invoiced'
  },
  {
    label: 'Invoice Confirmed',
    value: 'Invoice Confirmed'
  },
  {
    label: 'Cancelled',
    value: 'Cancelled'
  }
];

export const schemaSubmitInvoice = object().shape({
  invoice_number: string().required('Invoice number is required')
});

export type CreateBoxPackageType = {
  box: number;
  list_item?: ListItem[];
};

export type ListItem = {
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
  },
  {
    id: 'unit_of_measure',
    label: 'Unit of measure'
  }
];

export const headerTableNote = [
  {
    id: 'time_created',
    label: 'Time Created',
    textAlign: 'justify-start'
  },
  {
    id: 'from',
    label: 'From',
    textAlign: 'justify-start'
  },
  {
    id: 'details',
    label: 'Details',
    textAlign: 'justify-start'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

export const schemaNote = yup.object().shape({
  details: yup.string().required('Detail is required').max(250, 'Maximum length is 250 characters')
});

export const schemaShipment = yup.object().shape({
  carrier: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.string().nonNullable()
    })
    .required('Carrier is required'),
  shipping_service: yup
    .object()
    .shape({
      label: yup.string(),
      value: yup.string()
    })
    .required('Shipping services is required')
});

export const schemaShipTo = yup.object().shape({
  address_1: yup.string().required('Address 1 is required'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  day_phone: yup
    .string()
    .required('Phone is required')
    .matches(phoneRegExp, 'Phone number is invalid')
    .min(10, 'Too short'),
  contact_name: yup.string().required('Name is required'),
  postal_code: yup.string().required('Postal code is required'),
  state: yup.string().required('State is required')
});

export const schemaShipFrom = yup.object().shape({
  address_1: yup.string().required('Address 1 is required'),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  contact_name: yup.string().required('Name is required'),
  postal_code: yup.string().required('Postal code is required'),
  state: yup.string().required('State is required'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(phoneRegExp, 'Phone number is invalid')
    .min(10, 'Too short')
});

export const schemaWarehouse = object().shape({
  retailer_warehouse: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.number().nonNullable()
    })
    .required('Warehouse is required')
});

export const DOMAIN_RETAILER_ORDER_NOTES = 'retailer-purchase-order-notes';

export const DOMAIN_RETURN_ORDER_NOTES = 'retailer-purchase-order-return-notes'

export const REASON_RETURN_ORDER = [
  {
    label: 'Courtesy Return',
    value: 'courtesy_return'
  },
  {
    label: 'Ordered Wrong Item',
    value: 'ordered_wrong_item'
  },
  {
    label: 'Warranty',
    value: 'warranty'
  },
  {
    label: 'Changed Mind',
    value: 'changed_mind'
  },
  {
    label: 'Received Wrong Item',
    value: 'received_wrong_item'
  },
  {
    label: 'Rental',
    value: 'rental'
  },
  {
    label: 'Damaged',
    value: 'damaged'
  },
  {
    label: 'Defective',
    value: 'defective'
  },
  {
    label: 'Arrived Too Late',
    value: 'arrived_too_late'
  }
];

export const headerTableOrderReturn = [
  {
    id: 'merchant_sku',
    label: 'Merchant SKU',
    textAlign: 'justify-start'
  },
  {
    id: 'product_alias',
    label: 'Product Alias',
    textAlign: 'justify-start'
  },
  {
    id: 'return_qty',
    label: 'Return QTY',
    textAlign: 'justify-start'
  },
  {
    id: 'damaged',
    label: 'Damaged',
    textAlign: 'justify-start'
  },
  {
    id: 'reason',
    label: 'Reason',
    textAlign: 'justify-start'
  }
];

export const headerTableSectionOrderReturn = [
  {
    id: 'merchant_sku',
    label: 'Merchant SKU'
  },
  {
    id: 'product_alias',
    label: 'Product Alias'
  },
  {
    id: 'return_qty',
    label: 'Return QTY'
  },
  {
    id: 'damaged',
    label: 'Damaged'
  },
  {
    id: 'reason',
    label: 'Reason'
  }
];
