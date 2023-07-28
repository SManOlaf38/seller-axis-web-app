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
    verified_ship_to: null
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
        isLoading: true
      };
    }
    case constants.CREATE_SHIPMENT_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.CREATE_SHIPMENT_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.VERIFY_ADDRESS_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.VERIFY_ADDRESS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        orderDetail: {
          ...state.orderDetail,
          verified_ship_to: action.payload
        }
      };
    }
    case constants.VERIFY_ADDRESS_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.REVERT_ADDRESS_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.REVERT_ADDRESS_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        orderDetail: {
          ...state.orderDetail,
          verified_ship_to: null
        }
      };
    }
    case constants.REVERT_ADDRESS_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default OrderReducer;
