export const headerTable = [
  {
    id: 'sku',
    label: 'SKU'
  },
  {
    id: 'sub-total',
    label: 'Sub-Total'
  },
  {
    id: 'package_rule_zie',
    label: 'Package Rule Size'
  },
  {
    id: 'quantity',
    label: 'Quantity'
  }
];

export const dataDaily = [];

export const dataResult = [
  {
    product_sku: 'IB-002-5g-12W-WH',
    group: [
      {
        name: '1',
        count: 5,
        quantity: 5
      },
      {
        name: '6',
        count: 1,
        quantity: 6
      },
      {
        name: '12',
        count: 0,
        quantity: 0
      },
      {
        name: '24',
        count: 1,
        quantity: 24
      }
    ],
    sub_quantity: 35,
    available_quantity: 100
  },
  {
    product_sku: 'YT-122-4a-12e-FD',
    group: [
      {
        name: '1',
        count: 0,
        quantity: 0
      },
      {
        name: '6',
        count: 2,
        quantity: 12
      },
      {
        name: '12',
        count: 1,
        quantity: 12
      },
      {
        name: '24',
        count: 6,
        quantity: 144
      }
    ],
    sub_quantity: 168,
    available_quantity: 100
  }
];

const dataHeaderTableExpect = ['Modal', 'Sub-Total', '1', '6', '12', '24'];
