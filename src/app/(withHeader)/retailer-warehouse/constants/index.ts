import { number, object, string } from 'yup';

export const schemaRetailerWarehouse = object().shape({
  name: string().required('Name is required'),
  description: string().required('Description is required'),
  address: string().required('Address is required'),

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
    id: 'address',
    label: 'Address'
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
    id: 'created_at',
    label: 'Created at'
  },
  {
    id: 'action',
    label: 'Action'
  }
];
