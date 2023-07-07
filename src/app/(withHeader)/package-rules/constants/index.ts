import { object, string } from 'yup';

export const schemaPackageRule = object().shape({
  name: string().required('Name is required')
});
