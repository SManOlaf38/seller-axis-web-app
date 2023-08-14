import { number, object, string } from 'yup';

export const schemaProductAlias = object().shape({
  sku: string().required('SKU is required'),
  merchant_sku: string().required('Merchant SKU is required'),
  vendor_sku: string().required('Vendor SKU is required'),

  services: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Services rule is required'),

  retailer: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Retailer rule is required'),

  product: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Product rule is required'),
  sku_quantity: number()
    .min(1, 'Package quantity must be greater than or equal to 1')
    .typeError('Package quantity must be greater than or equal to 1')
    .required('Package quantity required')
});

export const schemaProductWarehouse = object().shape({
  retailer_warehouse: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Retailer warehouse is required'),
  qty_on_hand: number().required('QTY on hand is required').typeError('QTY on hand is required')
  // next_available_date: string().required('Next available date is required')
});

export const headerTable = [
  {
    id: 'sku',
    label: 'SKU Alias'
  },
  {
    id: 'product',
    label: 'Product'
  },
  {
    id: 'sku_quantity',
    label: 'Package Quantity'
  },
  {
    id: 'merchant_sku',
    label: 'Merchant SKU'
  },
  {
    id: 'vendor_sku',
    label: 'Vendor SKU'
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
