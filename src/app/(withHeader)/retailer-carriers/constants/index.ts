import { object, string, number } from 'yup';

export const schemaRetailerCarrier = object().shape({
  client_id: string().required('SKU is required'),
  client_secret: string().required('Merchant SKU is required'),

  service: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Service rule is required'),

  retailer: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Retailer rule is required')
});

export const headerTable = [
  {
    id: 'client_id',
    label: 'Client id'
  },
  {
    id: 'client_secret',
    label: 'Client secret'
  },
  {
    id: 'retailer',
    label: 'Retailer'
  },
  {
    id: 'service',
    label: 'Service'
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
