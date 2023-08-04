import * as yup from 'yup';

export const schemaBox = yup.object().shape({
  name: yup.string().required('Name is required'),
  length: yup
    .number()
    .typeError('Length is required')
    .min(0, 'Length must be greater than or equal to 0'),
  width: yup
    .number()
    .typeError('Width is required')
    .min(0, 'Width must be greater than or equal to 0'),
  height: yup
    .number()
    .typeError('Height is required')
    .min(0, 'Height must be greater than or equal to 0'),
  dimension_unit: yup.string(),
  barcode_size: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.number().nonNullable()
    })
    .required('Barcode size is required')
});

export const headerTable = [
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'length',
    label: 'length'
  },
  {
    id: 'wight',
    label: 'Wight'
  },
  {
    id: 'height',
    label: 'Height'
  },
  {
    id: 'dimension_unit',
    label: 'Dimension unit'
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
