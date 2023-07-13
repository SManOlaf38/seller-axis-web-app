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
  type: string().required('Type is required')
});
