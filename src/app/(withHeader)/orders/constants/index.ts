import { phoneRegExp } from '@/constants';
import { object, string } from 'yup';
import * as yup from 'yup';

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
    id: 'verify_address',
    label: 'Verify Address'
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
