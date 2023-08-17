import { Dispatch } from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Box } from '../../box/interface';
import { ProductAlias } from '../../inventory/interface';
import { RetailerCarrier } from '../../carriers/interface';
import { Retailer } from '../../retailers/interface';

export type ItemOrder = {
  created_at: string;
  description: string;
  description_2: string;
  expected_ship_date: string;
  id: string | number;
  merchant_line_number: string;
  merchant_sku: string;
  order: string | number;
  order_line_number: string;
  po_line_data: string;
  qty_ordered: string | number;
  product_alias: ProductAlias;
  retailer_purchase_order_item_id: string;
  shipping_code: string;
  unit_cost: string;
  unit_of_measure: string;
  upc: string;
  updated_at: string;
  vendor_sku: string;
};

export type ShipTo = {
  company?: string;
  address_1: string;
  address_2: string;
  address_rate_class: string;
  city: string;
  country: string;
  created_at: string;
  phone: string;
  email: string;
  id: string | number;
  name?: string;
  contact_name?: string;
  night_phone: string;
  partner_person_place_id: string;
  postal_code: string;
  retailer: string | number;
  retailer_person_place_id: string;
  state: string;
  day_phone?: number;
  updated_at: string;
};

export type PayloadValidateShipTo = {
  carrier_id?: number;
  company?: string;
  contact_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  status?: string;
};

export type ShipFrom = {
  company?: string;
  email?: string;
  address_1: string;
  city: string;
  address_2: string;
  country: string;
  created_at: string;
  phone: string;
  id: string | number;
  contact_name: string;
  postal_code: string;
  state: string;
  updated_at: string;
};

export type Customer = {
  name: string;
  company?: string;
  id: string | number;
  retailer_person_place_id: string;
  title: string;
  address_rate_class: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  day_phone: string;
  night_phone: string;
  partner_person_place_id: string;
  email: string;
  created_at: string;
  updated_at: string;
  retailer: number | string;
};

export type PayloadBulkShip = {
  id: number;
  carrier: number;
  shipping_service: string;
  shipping_ref_1: string;
  shipping_ref_2: string;
  shipping_ref_3: string;
  shipping_ref_4: string;
  shipping_ref_5: string;
};

export type PayloadCreateTokenInvoice = {
  auth_code: string;
  realm_id: string;
};

export type PayloadCreateInvoice = {
  access_token: string;
  realm_id: string;
};

export type PayloadRefreshToken = {
  refresh_token: string;
};

export type Order = {
  id: number | string;
  status: string;
  batch: {
    batch_number: string;
    created_at: string;
    id: string | number;
    partner: string | number;
    retailer: Retailer;
    updated_at: string;
  };
  carrier: RetailerCarrier | null;
  participating_party: any;
  ship_to: ShipTo | null;
  ship_from?: ShipFrom;
  verified_ship_to: ShipTo | null;
  bill_to: Customer | null;
  invoice_to: Customer | null;
  customer: Customer | null;
  items: ItemOrder[];
  retailer_purchase_order_id: string;
  transaction_id: string;
  senders_id_for_receiver: string;
  po_number: string;
  order_date: string;
  shipping_code: string;
  sales_division: string;
  vendor_warehouse_id: string;
  cust_order_number: string;
  po_hdr_data: {
    custOrderNumber: string;
    giftMessage: string;
    merchDept: string;
    poTypeCode: string;
    reqShipDate: string;
  } | null;
  control_number: string;
  buying_contract: string;
  created_at: string;
  updated_at: string;
  weight: string | number;
  ship_date: string | number;
  declared_value: string | number;
  order_packages: OrderPackage[];
  shipments: {
    carrier: number | string;
    created_at: string;
    id: number | string;
    order: number | string;
    package_document: string;
    status: string;
    tracking_number: string;
    updated_at: string;
  }[];
  shipping_service?: {
    [key: string]: string | number;
  };
  shipping_ref_1?: string;
  shipping_ref_2?: string;
  shipping_ref_3?: string;
  shipping_ref_4?: string;
  shipping_ref_5?: string;
};

export type ShipConfirmationType = {
  carrier: number;
  id: number;
  package: number;
  package_document: string;
  status: string;
  tracking_number: string;
};

export type ShipmentPackages = {
  carrier: number;
  created_at: string;
  id: number;
  package: number;
  package_document: string;
  sscc: string;
  status: string;
  tracking_number: string;
  type: {
    id: number;
    name: string;
    code: string;
    created_at: string;
    updated_at: string;
  };
  updated_at: string;
};

export type OrderPackage = {
  box: Box;
  created_at: string;
  dimension_unit: string;
  height: number | string;
  id: number | string;
  length: number | string;
  order: number | string;
  updated_at: string;
  weight: number | string;
  weight_unit: string;
  width: number | string;
  box_max_quantity: number;
  shipment_packages: ShipmentPackages[];
  [key: string]: any;
};

export type OrderPackages = {
  id: number | string;
  box: {
    id: number;
    name: string;
  };
  box_max_quantity: number;
  order_item_packages: OrderItemPackages[];
};

export type OrderItemPackages = {
  id: number;
  quantity: number;
  order_item: number;
  retailer_purchase_order_item: {
    id: number;
    product_alias: {
      sku: string;
      sku_quantity: number;
    };
    upc?: string;
  };
};

export type ListOrder = {
  count: number;
  next: string;
  previous: string;
  results: Order[];
};

export type PackageRule = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  organization: number;
};

export type OrderStateType = {
  dataOrder: ListOrder;
  isLoading: boolean;
  isLoadingCreateInvoice: boolean;
  isLoadingCreateManualShip: boolean;
  isLoadingNewOrder: boolean;
  isLoadingAcknowledge: boolean;
  isLoadingDeleteOrderPackage: boolean;
  isLoadingVerify: boolean;
  isLoadingShipment: boolean;
  isLoadingItemPackages: boolean;
  isDeleteItemPackages: boolean;
  isLoadingCreatePackageBox: boolean;
  isLoadingUpdateShipTo: boolean;
  isLoadingResetPackage: boolean;
  isLoadingSaveShipment: boolean;
  isLoadingShipConfirmation: boolean;
  isLoadingGetInvoice: boolean;
  error: string;
  orderDetail: Order;
  orderIds: number[];
  orders: {
    [key: string]: Order;
  };
  packageDivide: any[];
  countNewOrder: {
    id: number | string;
    retailers: {
      count: number | string;
      created_at: string;
      id: number | string;
      name: string;
      organization: number | string;
      type: string;
      updated_at: string;
    }[];
  };
  dataShippingService: any[];
};

export type ContextType = {
  state: OrderStateType;
  dispatch: Dispatch<any>;
};

export type GetPayload = {
  search: string;
  currentPage: number;
};

export type Payload = {
  id?: number;
  name?: string;
};

export type CreateOrder = {
  id?: string;
  sku: string;
  unit_of_measure: string;
  available: string;
  upc: string;
  description: string;
  unit_cost: number;
  qty_on_hand: number;
  qty_reserve: number;
  image: string | undefined;
  package_rule: number;
  cost?: string;
  warehouse?: string;
};

export type FormCreateOrder = {
  sku: string;
  unit_of_measure: string;
  available: string;
  upc: string;
  description: string;
  unit_cost: number;
  qty_on_hand: number;
  qty_reserve: number;
  image: string | undefined;
  package_rule: {
    value: number;
    label: string;
  };
};

export type FormOrderProps = {
  errors: FieldErrors<CreateOrder>;
  control: Control<CreateOrder, any>;
};

export type PayloadManualShip = {
  ship_date: string;
  tracking_number: string;
  service: {
    value: number;
    label: string;
  };
  carrier: {
    value: number;
    label: string;
  };
};

export type UpdateOrderItemPackages = {
  quantity: number;
};

export type CreateOrderItemPackages = {
  quantity: number;
  package: number;
  order_item: number;
};

export type FormCreateBoxPackage = {
  box_id: HTMLInputElement;
  po_item_id: HTMLInputElement;
  qty: number;
};

export type UpdateShipTo = {
  id: string | number;
  address_1: string;
  address_2: string;
  company: string;
  city: string;
  country: string;
  day_phone: string;
  email: string;
  name: string;
  postal_code: string;
  state: string;

  companyFrom: string;
  nameFrom: string;
  addressFrom: string;
  address2From: string;
  cityFrom: string;
  stateFrom: string;
  postal_codeFrom: string;
  countryFrom: string;
  phoneFrom: string;
  status: string;
  callback?: () => void;
};

export type UpdateShipFrom = {
  id?: string | number;
  company: string;
  contact_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  status: string;
  callback?: () => void;
};

export type SaveShipmentDetail = {
  ship_date: string;
  number_of_package: number;
  declared_value: number;
  id?: number;
  package_data: OrderPackage[];
  isEditDimensions?: boolean;
};
