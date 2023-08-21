import * as yup from 'yup';

export const schemaGs1 = yup.object().shape({
  name: yup.string().required('Name is required'),
  gs1: yup
    .string()
    .required('GS1 is required')
    .min(7, 'GS1 must more than or equal 7 characters')
    .matches(/^\d+(\.\d+)?$/, 'GS1 must be a numeric string')
});

export const headerTable = [
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'gs1',
    label: 'GS1'
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
