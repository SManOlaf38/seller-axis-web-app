import { object, string } from 'yup';

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
    value: 'commercehub',
    label: 'commercehub'
  }
];

export const schemaRetailer = object().shape({
  name: string().required('Name is required'),
  type: string()
});
