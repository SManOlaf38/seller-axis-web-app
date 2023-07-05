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
  ]
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
  }
];

export const schemaOrganization = yup.object().shape({
  name: yup.string().required(),
  avatar: yup.string(),
  email: yup.string(),
  description: yup.string(),
  phone: yup.string(),
  status: yup.string(),
  timezone: yup.string(),
  address: yup.string()
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
