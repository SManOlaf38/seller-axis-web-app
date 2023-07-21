import { number, object, string } from 'yup';

export const schemaProductSeries = object().shape({
  series: string().required('Series is required')
});

export const schemaProductWarehouse = object().shape({
  retailer_warehouse: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Retailer warehouse is required'),
  status: string().required('Status is required'),
  qty_on_hand: number().required('QTY on hand is required').typeError('QTY on hand is required')
});

export const headerTable = [
  {
    id: 'series',
    label: 'Series'
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
