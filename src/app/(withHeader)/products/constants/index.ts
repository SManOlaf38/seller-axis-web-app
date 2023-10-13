import { object, string, number } from 'yup';

export const headerTable = [
  {
    id: 'image',
    label: 'Image'
  },
  {
    id: 'sku',
    label: 'SKU',
    dataField: 'sku',
  },
  {
    id: 'unit_of_measure',
    label: 'Unit of measure',
    dataField: 'unit_of_measure',
  },
  {
    id: 'available',
    label: 'Available',
    dataField: 'available',
  },
  {
    id: 'upc',
    label: 'UPC',
    dataField: 'upc',
  },
  {
    id: 'product_series',
    label: 'Product series',
    dataField: 'product_series__series',
  },
  {
    id: 'unit_cost',
    label: 'Unit cost',
    dataField: 'unit_cost',
  },
  {
    id: 'weight_unit',
    label: 'Weight unit',
    dataField: 'weight_unit',
  },
  {
    id: 'qty_on_hand',
    label: 'On hand',
    dataField: 'qty_on_hand',
  },

  {
    id: 'qty_pending',
    label: 'Pending',
    dataField: 'qty_pending',
  },
  {
    id: 'qty_reserve',
    label: 'Reserve',
    dataField: 'qty_reserve',
  },
  {
    id: 'description',
    label: 'Description',
    dataField: 'description',
  },
  {
    id: 'created_at',
    label: 'Created at',
    dataField: 'created_at',
  },
  {
    id: 'action',
    label: 'Action'
  }
];

export const DATA_AVAILABLE = [
  {
    value: 'YES',
    label: 'YES'
  },
  {
    value: 'NO',
    label: 'NO'
  },
  {
    value: 'GUARANTEED',
    label: 'GUARANTEED'
  },
  {
    value: 'DISCONTINUED',
    label: 'DISCONTINUED'
  },

  {
    value: 'DELETED',
    label: 'DELETED'
  }
];

export const DATA_UNI_OF_MEASURES = [
  {
    value: 'In',
    label: 'In'
  },
  {
    value: 'LB',
    label: 'LB'
  },
  {
    value: 'Oz',
    label: 'Oz'
  }
];

export const DATA_WEIGH_UNIT = [
  {
    value: 'KG',
    label: 'KG'
  },
  {
    value: 'LB',
    label: 'LB'
  }
];

export const headerTableWarehouse = [
  {
    id: 'location',
    label: 'location'
  },
  {
    id: 'cost',
    label: 'Cost'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

export const schemaProduct = object().shape({
  sku: string().required('SKU is required'),
  unit_of_measure: string().required('Unit of measure is required'),
  weight_unit: string().required('Weight unit is required'),
  weight: string().required('Weight is required'),
  available: string().required('Available is required'),
  upc: string()
    .required('UPC is required')
    .matches(/^[0-9]+$/, 'UPC must contain only numbers'),
  unit_cost: number().required('Unit cost is required').typeError('Unit cost is required'),
  qty_on_hand: number().required('QTY on hand required').typeError('QTY on hand required'),
  qty_pending: number().required('QTY pending required').typeError('QTY pending required'),
  qty_reserve: number().required('QTY reserve is required').typeError('QTY reserve is required'),
  product_series: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Product series is required')
});

export const schemaPackageRule = object().shape({
  max_quantity: number()
    .min(1, 'Max quantity must be greater than or equal to 1')
    .required('Max quantity is required')
    .typeError('Unit cost is required'),
  box: object()
    .shape({
      label: string(),
      value: number()
    })
    .required('Box is required'),
  product: object()
    .shape({
      label: string(),
      value: number()
    })
    .required('Product is required')
});

export const keyBodyUploadFile = [
  { label: 'Image', key: 'image' },
  { label: 'SKU', key: 'sku' },
  { label: 'Unit of measure', key: 'unit_of_measure' },
  { label: 'Available', key: 'available' },
  { label: 'UPC', key: 'upc' },
  { label: 'Product series', key: 'product_series_name' },
  { label: 'Unit cost', key: 'unit_cost' },
  { label: 'Weight unit', key: 'weight_unit' },
  { label: 'On hand', key: 'qty_on_hand' },
  { label: 'Pending', key: 'qty_pending' },
  { label: 'Reserve', key: 'qty_reserve' },
  { label: 'Description', key: 'description' }
];
