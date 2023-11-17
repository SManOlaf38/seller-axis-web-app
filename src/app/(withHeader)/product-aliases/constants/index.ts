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
    .required('Package quantity required'),
  upc: string()
    .required('UPC is required')
    .matches(/^[0-9]+$/, 'UPC must contain only numbers'),
  availability: object()
  .shape({
    label: string().nonNullable(),
    value: string().nonNullable()
  }),
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
    label: 'SKU Alias',
    dataField: 'sku',
  },
  {
    id: 'product',
    label: 'Product',
    dataField: 'product__sku',
  },
  {
    id: 'sku_quantity',
    label: 'Package Quantity',
    dataField: 'sku_quantity',
  },
  {
    id: 'merchant_sku',
    label: 'Merchant SKU',
    dataField: 'merchant_sku',
  },
  {
    id: 'vendor_sku',
    label: 'Vendor SKU',
    dataField: 'vendor_sku',
  },
  {
    id: 'retailer',
    label: 'retailer',
    dataField: 'retailer__name',
  },
  {
    id: 'upc',
    label: 'UPC',
    dataField: 'upc',
  },
  {
    id: 'created_at',
    label: 'Created at',
    dataField: 'created_at',
  },
  {
    id: 'action',
    label: 'Action',
  }
];

export const availabilityData = [
  {
    label: "Available",
    value: "Available",
  },
  {
    label: "Unavailable",
    value: "Unavailable",
  },
  {
    label: "Discontinued",
    value: "Discontinued",
  },
  {
    label: "Guaranteed",
    value: "Guaranteed",
  },
];

