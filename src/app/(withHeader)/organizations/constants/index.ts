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

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const schemaOrganization = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().required('Email is required').email('Email must be a valid'),
  phone: yup.string().matches(phoneRegExp, 'Phone is not valid').required('Phone is required'),
  gs1: yup.string().required('GS1 prefix is required')
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
