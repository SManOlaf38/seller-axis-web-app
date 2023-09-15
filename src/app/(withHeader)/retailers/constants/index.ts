import { phoneRegExp } from '@/constants';
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
    id: 'default_gs1',
    label: 'Default GS1'
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
  vendor_id: string().required('Vendor id is required'),
  sftp_host: string().required('SFTP host is required'),
  sftp_username: string().required('SFTP user name is required'),
  sftp_password: string().required('SFTP password required'),

  contact_name: string().required('Name of ship from is required'),
  address_1: string().required('Address 1 is required'),
  city: string().required('City is required'),
  country: string().required('Country is required'),
  phone: string()
    .required('Phone is required')
    .matches(phoneRegExp, 'Phone number is invalid')
    .min(10, 'Too short'),
  postal_code: string().required('Postal code is required'),
  state: string().required('State is required')
});
