import { phoneRegExp } from '@/constants';
import * as yup from 'yup';

export const schema = yup.object().shape({
  first_name: yup.string(),
  last_name: yup.string(),
  email: yup.string().required('Email is required').email('Email invalidate'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(phoneRegExp, 'Phone number is not valid')
    .min(10, 'Too short'),
  avatar: yup.string()
});
