export const headerTable = [
  {
    id: 'box_name',
    label: 'Box Name'
  },
  {
    id: 'items',
    label: 'Items'
  },
  {
    id: 'qty',
    label: 'Quantity'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

export const headerTableEditPack = [
  {
    id: 'product',
    label: 'Product'
  },
  {
    id: 'qty',
    label: 'Quantity'
  },
  {
    id: 'action',
    label: 'Action'
  }
];

export type PackageDivide = {
  id: number | string;
  box_name: string;
  max_qty: number;
  products?: any;
};

export type ProductPackage = {
  id_product: number;
  item: string;
  qty: number;
};

export type ProductPackageSelect = {
  label: string;
  value: number;
};
