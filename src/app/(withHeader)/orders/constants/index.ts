import { object, string } from 'yup';

export const headerTable = [
  {
    id: 'po_number',
    label: 'PO number'
  },
  {
    id: 'customer',
    label: 'Customer'
  },
  {
    id: 'cust_order_number',
    label: 'Customer order number'
  },
  {
    id: 'order_date',
    label: 'Order date'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

export const schemaSubmitInvoice = object().shape({
  invoice_number: string().required('Invoice number is required')
});

export type CreateBoxPackageType = {
  box: number;
  order_item: number;
  quantity: number;
};
