import * as yup from 'yup';

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref(refString)], 'Password incorrect');
};

export const schema = yup.object().shape({
  old_password: yup.string().required('Password is required'),
  new_password: yup.string().required('New Password is required'),
  confirm_password: handleConfirmPasswordYup('new_password')
});
