import * as yup from 'yup';

export const schemaPackageRule = yup.object().shape({
  name: yup.string().required('Name is required'),
  length: yup
    .number()
    .typeError('Length is required')
    .min(0, 'Length must be greater than or equal to 0'),
  wight: yup
    .number()
    .typeError('Width is required')
    .min(0, 'Width must be greater than or equal to 0'),
  height: yup
    .number()
    .typeError('Height is required')
    .min(0, 'Height must be greater than or equal to 0'),
  dimension_unit: yup.string().required('Dimension unit is required')
});

export const DATA_Dimension_Unit = [
  {
    value: 'in',
    label: 'IN'
  },
  {
    value: 'lb',
    label: 'LB'
  },
  {
    value: 'oz',
    label: 'OZ'
  }
];

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
    label: 'Width'
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
