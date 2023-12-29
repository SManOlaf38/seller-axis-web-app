import { Dispatch } from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { Box } from '../../box/interface';
import { ProductAlias } from '../../inventory/interface';
import { RetailerCarrier } from '../../carriers/interface';
import { Retailer } from '../../retailers/interface';
import { RetailerWarehouse } from '../../warehouse/interface';

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
  qty_ordered: number;
  product_alias: ProductAlias;
  retailer_purchase_order_item_id: string;
  shipping_code: string;
  unit_cost: string;
  unit_of_measure: string;
  upc: string;
  updated_at: string;
  vendor_sku: string;
  cancel_reason: string;
  tax: number;
  shipping: number;
  ship_qty_ordered: number;
  reason?: string;
};

export type DataPrint = {
  list_item: [];
  data_print: DataPrintAll[];
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
  status: string;
  classification?: string;
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

export type PayloadCancelOrder = {
  id_item: number;
  qty: number;
  reason: string;
};

export type ShipFrom = {
  classification?: string;
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
  status: string;
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
  status_history: [string];
  status: string;
  batch: {
    batch_number: string;
    created_at: string;
    id: string | number;
    partner: string | number;
    retailer: Retailer;
    updated_at: string;
  };
  gs1?: {
    [key: string]: string | number;
  };
  carrier: RetailerCarrier | null;
  order_full_divide?: boolean;
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
    salesAgent: string;
    merchandiseTypeCode?: string;
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
  invoice_order?: {
    created_at: string;
    doc_number: string;
    id: number;
    invoice_id: number;
    order: number;
  };
  estimated_delivery_date?: string;
  warehouse?: RetailerWarehouse;
  warehouses?: RetailerWarehouse[];
  list_box_valid?: {
    box_id: number;
    max_quantity: number;
  }[];
  notes?: NoteOrder[];
  print_data?: PrintData[];
  order_returns?: TypeOrderReturn[];
};

export type PrintData = {
  list_item: ItemOrder[];
  list_package: number[];
};

export type NoteOrder = {
  id: number;
  user: User;
  details: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
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
      upc?: string;
    };
    upc?: string;
    qty_ordered?: number;
  };
};

export type AccTypeBarcode = {
  [key: number]: {
    orderId: number;
    barcode: {
      orderId: number;
      quantity: number;
    }[];
  };
};

export type DataPrintAll = {
  box: number;
  barcode: BarCode[];
  label: string;
  gs1: {
    sscc: string;
    tempSsccBarcode: string;
  };
};

export type ListOrder = {
  count: number;
  next: string;
  previous: string;
  results: Order[];
  last_excution: string;
  next_excution: string;
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
  isLoadingCreateBulkPackageBox: boolean;
  isLoadingNewOrder: boolean;
  isLoadingAcknowledge: boolean;
  isLoadingDeleteOrderPackage: boolean;
  isLoadingVerify: boolean;
  isLoadingRevert: boolean;
  isLoadingShipment: boolean;
  isLoadingItemPackages: boolean;
  isDeleteItemPackages: boolean;
  isLoadingCreatePackageBox: boolean;
  isLoadingUpdateShipTo: boolean;
  isLoadingResetPackage: boolean;
  isLoadingSaveShipment: boolean;
  isLoadingShipConfirmation: boolean;
  isLoadingInvoiceConfirmation: boolean;
  isLoadingVerifyBulk: boolean;
  isLoadingGetInvoice: boolean;
  isLoadingCancelOrder: boolean;
  isLoadingByPass: boolean;
  isLoadingBackOrder: boolean;
  isLoadingUpdateWarehouseOrder: boolean;
  isLoadingCreateNote: boolean;
  isLoadingUpdateNote: boolean;
  isLoadingDeleteNote: boolean;
  isLoadingVoidShip: boolean;
  isLoadingCreateReturnNote: boolean;
  isUpdateReturnOrder: boolean;
  isDeleteReturnOrder: boolean;
  isAddReturnOrder: boolean;
  isLoadingUpdateDispute: boolean;
  isLoadingReturnReason: boolean;
  isLoadingReturnResult: boolean;
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
  dataShippingService: ShippingService[];
};

export type ShippingService = {
  code: string;
  created_at: string;
  id: string | number;
  name: string;
  service: string | number;
  updated_at: string;
  is_require_residential: false;
  max_length: number;
  max_length_plus_girth: number;
  max_weight: number;
  max_package: number;
  min_weight: number;
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

export type Shipment = {
  carrier: { value: string; label: string };
  shipping_ref_1: string;
  shipping_ref_2: string;
  shipping_ref_3: string;
  shipping_ref_4: string;
  shipping_ref_5: string;
  shipping_service: { label: string; value: string };
  gs1: { value: number; label: string };
};

export type BarCode = {
  quantity: number;
  sku: string;
  upc: string;
  orderId: number;
};

export type Label = {
  data: string;
  orderId: number;
};

export type ItemTableAddBox = {
  box: {
    id: number;
    name: string;
    box_max_quantity: number;
  };
  order_item_packages: ItemOrderItemPack[];
};

export type ItemOrderItemPack = {
  idSku: number;
  qty_ordered: number;
  sku: string;
  sku_quantity: number;
};

export type RetailerPurchaseOrderItem = {
  id: number;
  product_alias: {
    sku: string;
    sku_quantity: number;
    upc?: string;
  };
  upc?: string;
  qty_ordered?: number;
};

export type CreateBulkItemBox = {
  box?: number;
  item?: ItemBox[];
};

export type ItemBox = {
  order_item: number;
  quantity: number;
};

export type FromCreateNote = {
  details: string;
  order: number;
};

export type OrderReturnNote = {
  id: string;
  first_name: string;
  last_name: string;
  details: string;
  created_at: string;
};

export type OrderItemReturn = {
  id: number;
  merchant_sku: string;
  product_alias: {
    id: number;
    product_name: string;
    sku: string;
    merchant_sku: string;
  };
  return_qty: number;
  damaged: number;
  reason: string;
  ship_qty_ordered: number;
};

export type FromCreateReturnNote = {
  notes: [
    {
      details: string;
    }
  ];
  order_returns_items: [
    {
      return_qty: number;
      damaged_qty: number;
      reason: string;
      item: number;
    }
  ];
  order: number;
  warehouse: number;
};

export type TypeOrderReturn = {
  dispute_id: string;
  dispute_reason: string;
  dispute_at: string;
  updated_dispute_at: string;
  dispute_status: string;
  dispute_result: string;
  reimbursed_amount: number | null;
  status: string;
  id: number;
  notes: Notes[];
  order_returns_items: OrderReturnsItems[];
  is_dispute: false;
  dispute_date: null;
  created_at: string;
  updated_at: string;
  order: number;
  warehouse: RetailerWarehouse;
};

export type Notes = {
  id: number;
  details: string;
  created_at: string;
  updated_at: string;
  user: User;
  order_return: number;
};

export type OrderReturnsItems = {
  id: number;
  item: ItemOrder;
  return_qty: number;
  damaged_qty: number;
  reason: string;
  created_at: string;
  updated_at: string;
  order_return: number;
};

export type FormOrderReturn = {
  details: string;
  order_return: number;
};

export type FormUpdateDispute = {
  is_dispute: boolean;
  dispute_date: string | null;
};

export type DisputeReason = {
  dispute_id: string;
  date: string;
  reason: {
    label: string;
    value: string;
  };
};

export type DisputeResult = {
  dispute_id: string;
  reimbursed_amount: number;
  result: {
    label: string;
    value: string;
  };
};

export type BodyDisputeResult = {
  dispute_id: string;
  dispute_reason: string;
  dispute_at: string;
  dispute_status: string;
  updated_dispute_at: string;
};

export type BodyDeleteDisputeResult = {
  dispute_id: null | string;
  dispute_reason: null | string;
  reimbursed_amount: null | string;
  dispute_result: null | string;
  dispute_at: null | string;
  updated_dispute_at: null | string;
  dispute_status: null | string;
};

export type BodyDispute = {
  dispute_id: string;
  dispute_result: string;
  reimbursed_amount: number | null;
  dispute_status: string;
  updated_dispute_at: string;
};
