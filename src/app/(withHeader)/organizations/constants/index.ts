import { phoneRegExp } from '@/constants';
import * as yup from 'yup';

export const listMenu = (id: string) => {
  return [
    {
      name: 'General',
      url: `/organizations/${id}/settings`
    },
    {
      name: 'Member',
      url: `/organizations/${id}/members`
    }
  ];
};

export const headerTable = [
  {
    id: 'name',
    label: 'Name'
  },
  {
    id: 'email',
    label: 'Email'
  },
  {
    id: 'role',
    label: 'Role'
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

export const schemaOrganization = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email('Email must be a valid'),
  phone: yup
    .string()
    .required('Phone is required')
    .matches(phoneRegExp, 'Phone number is invalid')
    .min(10, 'Too short')
});

export const schemaInviteMember = yup.object().shape({
  email: yup.string().required('Email is required').email().nonNullable(),
  role: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.number().nonNullable()
    })
    .required('Role is required')
});
