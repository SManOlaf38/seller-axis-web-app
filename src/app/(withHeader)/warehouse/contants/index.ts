import * as Yup from 'yup';

export const SchemaWarehouse = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
});