import { object, string, number } from 'yup';

export const schemaSFTP = object().shape({
  sftp_host: string().required('SFTP host is required'),
  sftp_username: string().required('SFTP username is required'),
  sftp_password: string().required('SFTP password is required'),

  retailer: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Retailer is required'),
});

export const headerTable = [
  {
    id: 'sftp_host',
    label: 'SFTP host'
  },
  {
    id: 'sftp_username',
    label: 'SFTP username'
  },
  {
    id: 'retailer',
    label: 'retailer'
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
