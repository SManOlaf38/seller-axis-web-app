import { object, string, number } from 'yup';

export const headerTable = [
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'type',
    label: 'Type'
  },
  {
    id: 'merchant_id',
    label: 'Merchant ID'
  },
  {
    id: 'qbo_customer_ref_id',
    label: 'Quick books Customer'
  },
  {
    id: 'default_carrier',
    label: 'Default carrier'
  },
  {
    id: 'default_warehouse',
    label: 'Default warehouse'
  },
  {
    id: 'created_at',
    label: 'Created at'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

export const DATA_TYPE = [
  {
    value: 'CommerceHub',
    label: 'CommerceHub'
  },
  {
    value: 'Amazon',
    label: 'Amazon'
  },
  {
    value: 'Walmart',
    label: 'Walmart'
  }
];

export const schemaRetailer = object().shape({
  name: string().required('Name is required'),
  merchant_id: string().required('Merchant ID is required'),
  type: string().required('Type is required'),
  qbo_customer_ref_id: string(),
  vendor_id: string().required('Vendor id is required')
});
