import { object, string, number } from 'yup';

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
    .required('Product rule is required')
});
