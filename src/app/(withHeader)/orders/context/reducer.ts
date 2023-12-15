import type { OrderStateType, TypeOrderReturn } from '../interface';
import * as constants from './constant';

export const initialState: OrderStateType = {
  dataOrder: {
    count: 0,
    next: '',
    previous: '',
    results: [],
    last_excution: '',
    next_excution: ''
  },
  isLoading: true,
  isLoadingCreateManualShip: false,
  isLoadingCreateInvoice: false,
  isLoadingNewOrder: false,
  isLoadingAcknowledge: false,
  isLoadingDeleteOrderPackage: false,
  isLoadingVerify: false,
  isLoadingRevert: false,
  isLoadingShipment: false,
  isLoadingItemPackages: false,
  isDeleteItemPackages: false,
  isLoadingCreatePackageBox: false,
  isLoadingUpdateShipTo: false,
  isLoadingResetPackage: false,
  isLoadingSaveShipment: false,
  isLoadingShipConfirmation: false,
  isLoadingInvoiceConfirmation: false,
  isLoadingVerifyBulk: false,
  isLoadingGetInvoice: false,
  isLoadingCancelOrder: false,
  isLoadingByPass: false,
  isLoadingBackOrder: false,
  isLoadingUpdateWarehouseOrder: false,
  isLoadingCreateBulkPackageBox: false,
  isLoadingCreateNote: false,
  isLoadingUpdateNote: false,
  isLoadingDeleteNote: false,
  isLoadingVoidShip: false,
  isLoadingCreateReturnNote: false,
  isUpdateReturnOrder: false,
  isDeleteReturnOrder: false,
  isAddReturnOrder: false,
  isLoadingUpdateDispute: false,
  error: '',
  orderIds: [],
  orders: {},
  orderDetail: {
    id: '',
    batch: {
      batch_number: '',
      created_at: '',
      id: '',
      partner: '',
      retailer: {
        created_at: '',
        name: '',
        type: '',
        merchant_id: '',
        qbo_customer_ref_id: '',
        default_carrier: {
          client_id: '',
          client_secret: '',
          created_at: '',
          id: '',
          updated_at: '',
          account_number: '',
          retailer: {
            created_at: '',
            id: '',
            name: '',
            organization: '',
            type: '',
            updated_at: '',
            merchant_id: ''
          },
          service: {
            created_at: '',
            general_client_id: '',
            general_client_secret: '',
            id: '',
            name: '',
            type: '',
            updated_at: ''
          },
          shipper: {
            name: '',
            attention_name: '',
            tax_identification_number: '',
            phone: '',
            email: '',
            shipper_number: '',
            fax_number: '',
            address: '',
            city: '',
            state: '',
            postal_code: '',
            country: '',
            company: ''
          }
        }
      },
      updated_at: ''
    },
    participating_party: '',
    ship_to: null,
    bill_to: null,
    invoice_to: null,
    status_history: [''],
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
    shipments: [],
    status: '',
    order_returns: []
  },
  packageDivide: [],
  countNewOrder: {
    id: '',
    retailers: []
  },
  dataShippingService: []
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
        isLoadingCreateManualShip: true
      };
    }
    case constants.CREATE_MANUAL_SHIP_SUCCESS: {
      return {
        ...state,
        isLoadingCreateManualShip: false
      };
    }
    case constants.CREATE_MANUAL_SHIP_FAIL: {
      return {
        ...state,
        isLoadingCreateManualShip: false
      };
    }

    case constants.CREATE_INVOICE_QUICK_BOOK_REQUEST: {
      return {
        ...state,
        isLoadingCreateInvoice: true
      };
    }
    case constants.CREATE_INVOICE_QUICK_BOOK_SUCCESS: {
      return {
        ...state,
        isLoadingCreateInvoice: false
      };
    }
    case constants.CREATE_INVOICE_QUICK_BOOK_FAIL: {
      return {
        ...state,
        isLoadingCreateInvoice: false
      };
    }

    case constants.CREATE_TOKEN_INVOICE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.CREATE_TOKEN_INVOICE_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.CREATE_TOKEN_INVOICE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.REFRESH_TOKEN_TOKEN_INVOICE_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case constants.REFRESH_TOKEN_TOKEN_INVOICE_SUCCESS: {
      return {
        ...state,
        isLoading: false
      };
    }
    case constants.REFRESH_TOKEN_TOKEN_INVOICE_FAIL: {
      return {
        ...state,
        isLoading: false
      };
    }

    case constants.CREATE_INVOICE_REQUEST: {
      return {
        ...state,
        isLoadingCreateInvoice: true
      };
    }
    case constants.CREATE_INVOICE_SUCCESS: {
      return {
        ...state,
        isLoadingCreateInvoice: false
      };
    }
    case constants.CREATE_INVOICE_FAIL: {
      return {
        ...state,
        isLoadingCreateInvoice: false
      };
    }

    case constants.CANCEL_ORDER_REQUEST: {
      return {
        ...state,
        isLoadingCancelOrder: true
      };
    }
    case constants.CANCEL_ORDER_SUCCESS: {
      return {
        ...state,
        isLoadingCancelOrder: false
      };
    }
    case constants.CANCEL_ORDER_FAIL: {
      return {
        ...state,
        isLoadingCancelOrder: false
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
          verified_ship_to: action.payload
        }
      };
    }
    case constants.REVERT_ADDRESS_FAIL: {
      return {
        ...state,
        isLoadingVerify: false
      };
    }

    case constants.REVERT_SHIP_FROM_ADDRESS_REQUEST: {
      return {
        ...state,
        isLoadingRevert: true
      };
    }
    case constants.REVERT_SHIP_FROM_ADDRESS_SUCCESS: {
      return {
        ...state,
        isLoadingRevert: false
      };
    }
    case constants.REVERT_SHIP_FROM_ADDRESS_FAIL: {
      return {
        ...state,
        isLoadingRevert: false
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

    case constants.CREATE_BULK_BOX_PACKAGE_REQUEST: {
      return {
        ...state,
        isLoadingCreateBulkPackageBox: true
      };
    }
    case constants.CREATE_BULK_BOX_PACKAGE_SUCCESS: {
      return {
        ...state,
        isLoadingCreateBulkPackageBox: false
      };
    }
    case constants.CREATE_BULK_BOX_PACKAGE_FAIL: {
      return {
        ...state,
        isLoadingCreateBulkPackageBox: false
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
          verified_ship_to: action.payload
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

    case constants.VERIFY_ADD_BULK_REQUEST: {
      return {
        ...state,
        isLoadingVerifyBulk: true
      };
    }
    case constants.VERIFY_ADD_BULK_SUCCESS: {
      return {
        ...state,
        isLoadingVerifyBulk: false
      };
    }
    case constants.VERIFY_ADD_BULK_FAIL: {
      return {
        ...state,
        isLoadingVerifyBulk: false
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

    case constants.INVOICE_CONFIRMATION_REQUEST: {
      return {
        ...state,
        isLoadingInvoiceConfirmation: true
      };
    }
    case constants.INVOICE_CONFIRMATION_SUCCESS: {
      return {
        ...state,
        isLoadingInvoiceConfirmation: false
      };
    }
    case constants.INVOICE_CONFIRMATION_FAIL: {
      return {
        ...state,
        isLoadingInvoiceConfirmation: false
      };
    }

    case constants.UPDATE_SHIP_FROM_REQUEST: {
      return {
        ...state,
        isLoadingUpdateShipTo: true
      };
    }
    case constants.UPDATE_SHIP_FROM_SUCCESS: {
      return {
        ...state,
        isLoadingUpdateShipTo: false,
        orderDetail: {
          ...state.orderDetail,
          ship_from: action.payload
        }
      };
    }
    case constants.UPDATE_SHIP_FROM_FAIL: {
      return {
        ...state,
        isLoadingUpdateShipTo: false
      };
    }

    case constants.GET_SHIPPING_SERVICE_REQUEST: {
      return {
        ...state
      };
    }
    case constants.GET_SHIPPING_SERVICE_SUCCESS: {
      return {
        ...state,
        dataShippingService: action.payload
      };
    }
    case constants.GET_SHIPPING_SERVICE_FAIL: {
      return {
        ...state
      };
    }

    case constants.BY_PASS_REQUEST: {
      return {
        ...state,
        isLoadingByPass: true
      };
    }
    case constants.BY_PASS_SUCCESS: {
      return {
        ...state,
        isLoadingByPass: false
      };
    }
    case constants.BY_PASS_FAIL: {
      return {
        ...state,
        isLoadingByPass: false
      };
    }

    case constants.DELETE_BULK_PACKAGE_REQUEST: {
      return {
        ...state,
        isLoadingDeleteOrderPackage: true
      };
    }
    case constants.DELETE_BULK_PACKAGE_SUCCESS: {
      return {
        ...state,
        isLoadingDeleteOrderPackage: false
      };
    }
    case constants.DELETE_BULK_PACKAGE_FAIL: {
      return {
        ...state,
        isLoadingDeleteOrderPackage: false
      };
    }

    case constants.UPDATE_BACK_ORDER_REQUEST: {
      return {
        ...state,
        isLoadingBackOrder: true
      };
    }
    case constants.UPDATE_BACK_ORDER_SUCCESS: {
      return {
        ...state,
        isLoadingBackOrder: false
      };
    }
    case constants.UPDATE_BACK_ORDER_FAIL: {
      return {
        ...state,
        isLoadingBackOrder: false
      };
    }

    case constants.UPDATE_WAREHOUSE_ORDER_REQUEST: {
      return {
        ...state,
        isLoadingUpdateWarehouseOrder: true
      };
    }
    case constants.UPDATE_WAREHOUSE_ORDER_SUCCESS:
    case constants.UPDATE_WAREHOUSE_ORDER_FAIL: {
      return {
        ...state,
        isLoadingUpdateWarehouseOrder: false
      };
    }

    case constants.CREATE_NOTE_REQUEST: {
      return {
        ...state,
        isLoadingCreateNote: true
      };
    }
    case constants.CREATE_NOTE_SUCCESS:
    case constants.CREATE_NOTE_FAIL: {
      return {
        ...state,
        isLoadingCreateNote: false
      };
    }

    case constants.UPDATE_NOTE_REQUEST: {
      return {
        ...state,
        isLoadingUpdateNote: true
      };
    }
    case constants.UPDATE_NOTE_SUCCESS:
    case constants.UPDATE_NOTE_FAIL: {
      return {
        ...state,
        isLoadingUpdateNote: false
      };
    }

    case constants.DELETE_NOTE_REQUEST: {
      return {
        ...state,
        isLoadingDeleteNote: true
      };
    }
    case constants.DELETE_NOTE_SUCCESS:
    case constants.DELETE_NOTE_FAIL: {
      return {
        ...state,
        isLoadingDeleteNote: false
      };
    }

    case constants.VOID_SHIP_REQUEST: {
      return {
        ...state,
        isLoadingVoidShip: true
      };
    }
    case constants.VOID_SHIP_SUCCESS:
    case constants.VOID_SHIP_FAIL: {
      return {
        ...state,
        isLoadingVoidShip: false
      };
    }

    case constants.CREATE_RETURN_NOTE_REQUEST: {
      return {
        ...state,
        isLoadingCreateReturnNote: true
      };
    }
    case constants.CREATE_RETURN_NOTE_SUCCESS:
    case constants.CREATE_RETURN_NOTE_FAIL: {
      return {
        ...state,
        isLoadingCreateReturnNote: false
      };
    }

    case constants.UPDATE_RETURN_NOTE_REQUEST: {
      return {
        ...state,
        isUpdateReturnOrder: true
      };
    }
    case constants.UPDATE_RETURN_NOTE_SUCCESS: {
      const updatedNote = action.payload;

      const newOrderReturns = state.orderDetail?.order_returns?.map((orderReturn) => {
        return {
          ...orderReturn,
          notes: orderReturn?.notes?.map((note) => {
            return note.id === updatedNote.id ? { ...note, ...updatedNote } : note;
          })
        };
      });

      return {
        ...state,
        isUpdateReturnOrder: false,
        orderDetail: {
          ...state.orderDetail,
          order_returns: newOrderReturns
        }
      };
    }
    case constants.UPDATE_RETURN_NOTE_FAIL: {
      return {
        ...state,
        isUpdateReturnOrder: false
      };
    }

    case constants.DELETE_RETURN_NOTE_REQUEST: {
      return {
        ...state,
        isDeleteReturnOrder: true
      };
    }
    case constants.DELETE_RETURN_NOTE_SUCCESS: {
      const deletedNoteId = action.payload;

      const newOrderReturns = state.orderDetail?.order_returns?.map((orderReturn) => {
        return {
          ...orderReturn,
          notes: orderReturn?.notes?.filter((note) => note?.id !== deletedNoteId)
        };
      });

      return {
        ...state,
        isDeleteReturnOrder: false,
        orderDetail: {
          ...state.orderDetail,
          order_returns: newOrderReturns
        }
      };
    }
    case constants.DELETE_RETURN_NOTE_FAIL: {
      return {
        ...state,
        isDeleteReturnOrder: false
      };
    }

    case constants.ADD_RETURN_NOTE_REQUEST: {
      return {
        ...state,
        isAddReturnOrder: true
      };
    }
    case constants.ADD_RETURN_NOTE_SUCCESS: {
      const itemNoteAdd = action.payload;

      const newOrderReturns = state.orderDetail?.order_returns?.map((orderReturn) => {
        return {
          ...orderReturn,
          notes: [itemNoteAdd, ...orderReturn?.notes]
        };
      });

      return {
        ...state,
        isAddReturnOrder: false,
        orderDetail: {
          ...state.orderDetail,
          order_returns: newOrderReturns
        }
      };
    }
    case constants.ADD_RETURN_NOTE_FAIL: {
      return {
        ...state,
        isAddReturnOrder: false
      };
    }

    case constants.UPDATE_DISPUTE_RETURN_NOTE_REQUEST: {
      return {
        ...state,
        isLoadingUpdateDispute: true
      };
    }
    case constants.UPDATE_DISPUTE_RETURN_NOTE_SUCCESS:
    case constants.UPDATE_DISPUTE_RETURN_NOTE_FAIL: {
      return {
        ...state,
        isLoadingUpdateDispute: false
      };
    }

    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default OrderReducer;
