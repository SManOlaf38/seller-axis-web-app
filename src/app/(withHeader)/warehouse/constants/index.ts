import { phoneRegExp } from '@/constants';
import { object, string } from 'yup';

export const schemaRetailerWarehouse = object().shape({
  name: string().required('Name is required'),
  description: string().required('Description is required'),
  address_1: string().required('Address 1 is required'),
  city: string().required('City is required'),
  state: string().required('State is required'),
  postal_code: string().required('Postal code is required'),
  country: string().required('Country is required'),
  phone: string()
    .required('Phone is required')
    .matches(phoneRegExp, 'Phone number is invalid')
    .min(10, 'Too short')
});

export const headerTable = [
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'address_1',
    label: 'Address 1'
  },
  {
    id: 'description',
    label: 'Description'
  },
  {
    id: 'city',
    label: 'City'
  },
  {
    id: 'state',
    label: 'State'
  },
  {
    id: 'postal_code',
    label: 'Postal code'
  },
  {
    id: 'country',
    label: 'Country'
  },
  {
    id: 'phone',
    label: 'Phone'
  },
  {
    id: 'action',
    label: 'Action'
  }
];
