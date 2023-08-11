import { number, object, string } from 'yup';

export const schemaRetailerWarehouse = object().shape({
  name: string().required('Name is required'),
  description: string().required('Description is required'),
  address_1: string().required('Address 1 is required'),
  address_2: string(),
  city: string(),
  state: string(),
  postal_code: string(),
  country: string(),
  phone: string(),
  retailer: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Retailer rule is required')
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
    id: 'address_2',
    label: 'Address 2'
  },
  {
    id: 'description',
    label: 'Description'
  },
  {
    id: 'retailer',
    label: 'retailer'
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
