import type { OrderStateType } from '../interface';
import * as constants from './constant';

export const initialState: OrderStateType = {
  dataOrder: {
    count: 0,
    next: '',
    previous: '',
    results: []
  },
  isLoading: false,
  isLoadingNewOrder: false,
  isLoadingAcknowledge: false,
  isLoadingDeleteOrderPackage: false,
  isLoadingVerify: false,
  isLoadingShipment: false,
  isLoadingItemPackages: false,
  isDeleteItemPackages: false,
  isLoadingCreatePackageBox: false,
  isLoadingUpdateShipTo: false,
  isLoadingResetPackage: false,
  isLoadingSaveShipment: false,
  isLoadingShipConfirmation: false,
  error: '',
  orderIds: [],
  orders: {},
  orderDetail: {
    id: '',
    batch: null,
    participating_party: '',
    ship_to: null,
    bill_to: null,
    invoice_to: null,
    customer: {
      name: '',
      id: '',
      retailer_person_place_id: '',
      title: '',
      address_rate_class: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
      day_phone: '',
      night_phone: '',
      partner_person_place_id: '',
      email: '',
      created_at: '',
      updated_at: '',
      retailer: ''
    },
    carrier: null,
    items: [],
    retailer_purchase_order_id: '',
    transaction_id: '',
    senders_id_for_receiver: '',
    po_number: '',
    order_date: '',
    shipping_code: '',
    sales_division: '',
    vendor_warehouse_id: '',
    cust_order_number: '',
    po_hdr_data: null,
    control_number: '',
    buying_contract: '',
    created_at: '',
    updated_at: '',
    weight: '',
    declared_value: '',
    ship_date: '',
    order_packages: [],
    verified_ship_to: null,
    shipments: []
  },
  packageDivide: [],
  countNewOrder: {
    id: '',
    retailers: []
  }
};

function OrderReducer(
  state: OrderStateType,
  action: {
    type: string;
    payload: any;
  }
) {
  switch (action.type) {
    case constants.GET_ORDER_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_ORDER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        dataOrder: action.payload
      };
    }
    case constants.GET_ORDER_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_PACKAGE_DIVIDE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.GET_PACKAGE_DIVIDE_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        packageDivide: action.payload
      };
    }
    case constants.GET_PACKAGE_DIVIDE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CREATE_MANUAL_SHIP_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.CREATE_MANUAL_SHIP_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.CREATE_MANUAL_SHIP_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CREATE_INVOICE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.CREATE_INVOICE_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.CREATE_INVOICE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CANCEL_ORDER_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.CANCEL_ORDER_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.CANCEL_ORDER_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.GET_COUNT_NEW_ORDER_REQUEST: {
      return {
        ...state,
        isLoadingNewOrder: true
      };
    }
    case constants.GET_COUNT_NEW_ORDER_SUCCESS: {
      return {
        ...state,
        isLoadingNewOrder: false,
        countNewOrder: action.payload
      };
    }
    case constants.GET_COUNT_NEW_ORDER_FAIL: {
      return {
        ...state,
        isLoadingNewOrder: false
      };
    }

    case constants.GET_NEW_ORDER_REQUEST: {
      return {
        ...state
      };
    }
    case constants.GET_NEW_ORDER_SUCCESS: {
      return {
        ...state
      };
    }
    case constants.GET_NEW_ORDER_FAIL: {
      return {
        ...state
      };
    }

    case constants.SET_ORDER_DETAIL: {
      return {
        ...state,
        orderDetail: action.payload
      };
    }

    case constants.CREATE_ACKNOWLEDGE_REQUEST: {
      return {
        ...state,
        isLoadingAcknowledge: true
      };
    }
    case constants.CREATE_ACKNOWLEDGE_SUCCESS: {
      return {
        ...state,
        isLoadingAcknowledge: false
      };
    }
    case constants.CREATE_ACKNOWLEDGE_FAIL: {
      return {
        ...state,
        isLoadingAcknowledge: false
      };
    }

    case constants.DELETE_ORDER_PACKAGE_REQUEST: {
      return {
        ...state,
        isLoadingDeleteOrderPackage: true
      };
    }
    case constants.DELETE_ORDER_PACKAGE_SUCCESS: {
      return {
        ...state,
        isLoadingDeleteOrderPackage: false
      };
    }
    case constants.DELETE_ORDER_PACKAGE_FAIL: {
      return {
        ...state,
        isLoadingDeleteOrderPackage: false
      };
    }

    case constants.CREATE_SHIPMENT_REQUEST: {
      return {
        ...state,
        isLoadingShipment: true
      };
    }
    case constants.CREATE_SHIPMENT_SUCCESS: {
      return {
        ...state,
        isLoadingShipment: false
      };
    }
    case constants.CREATE_SHIPMENT_FAIL: {
      return {
        ...state,
        isLoadingShipment: false
      };
    }

    case constants.VERIFY_ADDRESS_REQUEST: {
      return {
        ...state,
        isLoadingVerify: true
      };
    }
    case constants.VERIFY_ADDRESS_SUCCESS: {
      return {
        ...state,
        isLoadingVerify: false,
        orderDetail: {
          ...state.orderDetail,
          verified_ship_to: action.payload
        }
      };
    }
    case constants.VERIFY_ADDRESS_FAIL: {
      return {
        ...state,
        isLoadingVerify: false
      };
    }

    case constants.REVERT_ADDRESS_REQUEST: {
      return {
        ...state,
        isLoadingVerify: true
      };
    }
    case constants.REVERT_ADDRESS_SUCCESS: {
      return {
        ...state,
        isLoadingVerify: false,
        orderDetail: {
          ...state.orderDetail,
          verified_ship_to: null
        }
      };
    }
    case constants.REVERT_ADDRESS_FAIL: {
      return {
        ...state,
        isLoadingVerify: false
      };
    }

    case constants.DELETE_ORDER_ITEM_PACKAGES_REQUEST: {
      return {
        ...state,
        isDeleteItemPackages: true
      };
    }
    case constants.DELETE_ORDER_ITEM_PACKAGES_SUCCESS: {
      return {
        ...state,
        isDeleteItemPackages: false
      };
    }
    case constants.DELETE_ORDER_ITEM_PACKAGES_FAIL: {
      return {
        ...state,
        isDeleteItemPackages: false
      };
    }

    case constants.CREATE_ORDER_ITEM_PACKAGES_REQUEST: {
      return {
        ...state,
        isLoadingItemPackages: true
      };
    }
    case constants.CREATE_ORDER_ITEM_PACKAGES_SUCCESS: {
      return {
        ...state,
        isLoadingItemPackages: false
      };
    }
    case constants.CREATE_ORDER_ITEM_PACKAGES_FAIL: {
      return {
        ...state,
        isLoadingItemPackages: false
      };
    }

    case constants.UPDATE_ORDER_ITEM_PACKAGES_REQUEST: {
      return {
        ...state,
        isLoadingItemPackages: true
      };
    }
    case constants.UPDATE_ORDER_ITEM_PACKAGES_SUCCESS: {
      return {
        ...state,
        isLoadingItemPackages: false
      };
    }
    case constants.UPDATE_ORDER_ITEM_PACKAGES_FAIL: {
      return {
        ...state,
        isLoadingItemPackages: false
      };
    }

    case constants.CREATE_BOX_PACKAGE_REQUEST: {
      return {
        ...state,
        isLoadingCreatePackageBox: true
      };
    }
    case constants.CREATE_BOX_PACKAGE_SUCCESS: {
      return {
        ...state,
        isLoadingCreatePackageBox: false
      };
    }
    case constants.CREATE_BOX_PACKAGE_FAIL: {
      return {
        ...state,
        isLoadingCreatePackageBox: false
      };
    }

    case constants.UPDATE_SHIP_TO_REQUEST: {
      return {
        ...state,
        isLoadingUpdateShipTo: true
      };
    }
    case constants.UPDATE_SHIP_TO_SUCCESS: {
      return {
        ...state,
        isLoadingUpdateShipTo: false,
        orderDetail: {
          ...state.orderDetail,
          ship_to: action.payload
        }
      };
    }
    case constants.UPDATE_SHIP_TO_FAIL: {
      return {
        ...state,
        isLoadingUpdateShipTo: false
      };
    }

    case constants.GET_RESET_PACKAGE_REQUEST: {
      return {
        ...state,
        isLoadingResetPackage: true
      };
    }
    case constants.GET_RESET_PACKAGE_SUCCESS: {
      return {
        ...state,
        isLoadingResetPackage: false
      };
    }
    case constants.GET_RESET_PACKAGE_FAIL: {
      return {
        ...state,
        isLoadingResetPackage: false
      };
    }

    case constants.SAVE_SHIPMENT_DETAIL_REQUEST: {
      return {
        ...state,
        isLoadingSaveShipment: true
      };
    }
    case constants.SAVE_SHIPMENT_DETAIL_SUCCESS: {
      return {
        ...state,
        isLoadingSaveShipment: false,
        orderDetail: {
          ...state.orderDetail,
          ...action.payload
        }
      };
    }
    case constants.SAVE_SHIPMENT_DETAIL_FAIL: {
      return {
        ...state,
        isLoadingSaveShipment: false
      };
    }

    case constants.CREATE_ACKNOWLEDGE_BULK_REQUEST: {
      return {
        ...state,
        isLoadingAcknowledge: true
      };
    }
    case constants.CREATE_ACKNOWLEDGE_BULK_SUCCESS: {
      return {
        ...state,
        isLoadingAcknowledge: false
      };
    }
    case constants.CREATE_ACKNOWLEDGE_BULK_FAIL: {
      return {
        ...state,
        isLoadingAcknowledge: false
      };
    }

    case constants.SHIP_BULK_REQUEST: {
      return {
        ...state,
        isLoadingShipment: true
      };
    }
    case constants.SHIP_BULK_SUCCESS: {
      return {
        ...state,
        isLoadingShipment: false
      };
    }
    case constants.SHIP_BULK_FAIL: {
      return {
        ...state,
        isLoadingShipment: false
      };
    }

    case constants.SHIP_CONFIRMATION_REQUEST: {
      return {
        ...state,
        isLoadingShipConfirmation: true
      };
    }
    case constants.SHIP_CONFIRMATION_SUCCESS: {
      return {
        ...state,
        isLoadingShipConfirmation: false
      };
    }
    case constants.SHIP_CONFIRMATION_FAIL: {
      return {
        ...state,
        isLoadingShipConfirmation: false
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default OrderReducer;
