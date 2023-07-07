import * as yup from 'yup';

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
    id: 'package_rule_id',
    label: 'package rule id'
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
    value: 'oz',
    label: 'OZ'
  },
  {
    value: 'ml',
    label: 'ML'
  },
  {
    value: 'pieces',
    label: 'PIECES'
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

export const schemaProduct = yup.object().shape({
  sku: yup.string().required('SKU is required'),
  unit_of_measure: yup.string().required('Unit of measure is required'),
  available: yup.string().required('Available is required'),
  upc: yup.string().required('UPC is required'),
  description: yup.string().required('Description is required'),
  image: yup.string().required('Image is required'),

  unit_cost: yup.number().required('Unit cost is required'),
  qty_on_hand: yup.number().required('QTY on hand required'),
  qty_reserve: yup.number().required('QTY reserve is required'),

  package_rule: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.number().nonNullable()
    })
    .required('Package rule is required')
});
