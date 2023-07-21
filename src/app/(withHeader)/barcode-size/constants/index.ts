import * as yup from 'yup';

export const schemaBarcodeSize = yup.object().shape({
  name: yup.string().required('Name is required'),
  width: yup
    .number()
    .typeError('Width is required')
    .min(0, 'Width must be greater than or equal to 0'),
  height: yup
    .number()
    .typeError('Height is required')
    .min(0, 'Height must be greater than or equal to 0')
});

export const headerTable = [
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'width',
    label: 'Width'
  },
  {
    id: 'height',
    label: 'Height'
  },
  {
    id: 'multiple_per_label',
    label: 'Multiple per label'
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
