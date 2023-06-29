import * as yup from 'yup';

export const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Confirm password is required')
    .oneOf([yup.ref(refString)], 'Confirm password does not match');
};

export const schema = yup.object().shape({
  first_name: yup.string(),
  last_name: yup.string(),
  email: yup.string().required('Email is required').email('Email invalidate'),
  password: yup.string().required('Password is required'),
  confirm_password: handleConfirmPasswordYup('password'),
});
