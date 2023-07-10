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
  error: '',
  orderDetail: {
    id: '',
    batch: '',
    participating_party: '',
    ship_to: '',
    bill_to: '',
    invoice_to: '',
    customer: {},
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
    po_hdr_data: '',
    control_number: '',
    buying_contract: '',
    created_at: '',
    updated_at: ''
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

    case constants.GET_ORDER_DETAIL_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }

    case constants.GET_ORDER_DETAIL_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        orderDetail: action.payload
      };
    }
    case constants.GET_ORDER_DETAIL_FAIL: {
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
