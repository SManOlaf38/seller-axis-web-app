import { object, string, number } from 'yup';

export const headerTable = [
  {
    id: 'image',
    label: 'Image'
  },
  {
    id: 'sku',
    label: 'SKU'
  },
  {
    id: 'unit_of_measure',
    label: 'Unit of measure'
  },
  {
    id: 'available',
    label: 'Available'
  },
  {
    id: 'upc',
    label: 'UPC'
  },
  {
    id: 'unit_cost',
    label: 'Unit cost'
  },
  {
    id: 'qty_on_hand',
    label: 'on hand'
  },
  {
    id: 'qty_reserve',
    label: 'Reserve'
  },
  {
    id: 'package_rule',
    label: 'package rule'
  },
  {
    id: 'description',
    label: 'Description'
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
    value: 'in',
    label: 'In'
  },
  {
    value: 'lb',
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
  available: string().required('Available is required'),
  upc: string().required('UPC is required'),
  description: string().required('Description is required'),
  image: string().required('Image is required'),

  unit_cost: number().required('Unit cost is required'),
  qty_on_hand: number().required('QTY on hand required'),
  qty_reserve: number().required('QTY reserve is required'),

  package_rule: object()
    .shape({
      label: string().nonNullable(),
      value: number().nonNullable()
    })
    .required('Package rule is required')
});
