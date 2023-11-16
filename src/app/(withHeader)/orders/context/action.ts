import type { Order, OrderItemPackages } from '../interface';
import * as constants from './constant';

export const getOrderRequest = () => ({
  type: constants.GET_ORDER_REQUEST
});
export const getOrderSuccess = (payload: object) => ({
  type: constants.GET_ORDER_SUCCESS,
  payload
});
export const getOrderFailure = (payload: any) => ({
  type: constants.GET_ORDER_FAIL,
  payload
});

export const getPackageDivideRequest = () => ({
  type: constants.GET_PACKAGE_DIVIDE_REQUEST
});
export const getPackageDivideSuccess = (payload: object) => ({
  type: constants.GET_PACKAGE_DIVIDE_SUCCESS,
  payload
});
export const getPackageDivideFailure = (payload: any) => ({
  type: constants.GET_PACKAGE_DIVIDE_FAIL,
  payload
});

export const createManualShipRequest = () => ({
  type: constants.CREATE_MANUAL_SHIP_REQUEST
});
export const createManualShipSuccess = (payload: object) => ({
  type: constants.CREATE_MANUAL_SHIP_SUCCESS,
  payload
});
export const createManualShipFailure = (payload: any) => ({
  type: constants.CREATE_MANUAL_SHIP_FAIL,
  payload
});

export const setOrderDetail = (payload: Order) => ({
  type: constants.SET_ORDER_DETAIL,
  payload
});

export const createInvoiceQuickBookShipRequest = () => ({
  type: constants.CREATE_INVOICE_QUICK_BOOK_REQUEST
});
export const createInvoiceQuickBookShipSuccess = () => ({
  type: constants.CREATE_INVOICE_QUICK_BOOK_SUCCESS
});
export const createInvoiceQuickBookShipFailure = (payload: any) => ({
  type: constants.CREATE_INVOICE_QUICK_BOOK_FAIL,
  payload
});

export const createInvoiceRequest = () => ({
  type: constants.CREATE_INVOICE_REQUEST
});
export const createInvoiceSuccess = () => ({
  type: constants.CREATE_INVOICE_SUCCESS
});
export const createInvoiceFailure = (payload: any) => ({
  type: constants.CREATE_INVOICE_FAIL,
  payload
});

export const createTokenInvoiceRequest = () => ({
  type: constants.CREATE_TOKEN_INVOICE_REQUEST
});
export const createTokenInvoiceSuccess = () => ({
  type: constants.CREATE_TOKEN_INVOICE_SUCCESS
});
export const createTokenInvoiceFailure = (payload: any) => ({
  type: constants.CREATE_TOKEN_INVOICE_FAIL,
  payload
});

export const refreshTokenInvoiceRequest = () => ({
  type: constants.REFRESH_TOKEN_TOKEN_INVOICE_REQUEST
});
export const refreshTokenInvoiceSuccess = () => ({
  type: constants.REFRESH_TOKEN_TOKEN_INVOICE_SUCCESS
});
export const refreshTokenInvoiceFailure = (payload: any) => ({
  type: constants.REFRESH_TOKEN_TOKEN_INVOICE_FAIL,
  payload
});

export const cancelOrderRequest = () => ({
  type: constants.CANCEL_ORDER_REQUEST
});
export const cancelOrderSuccess = () => ({
  type: constants.CANCEL_ORDER_SUCCESS
});
export const cancelOrderFailure = (payload: string) => ({
  type: constants.CANCEL_ORDER_FAIL,
  payload
});

export const getCountNewOrderRequest = () => ({
  type: constants.GET_COUNT_NEW_ORDER_REQUEST
});
export const getCountNewOrderSuccess = (payload: object) => ({
  type: constants.GET_COUNT_NEW_ORDER_SUCCESS,
  payload
});
export const getCountNewOrderFailure = (payload: any) => ({
  type: constants.GET_COUNT_NEW_ORDER_FAIL,
  payload
});

export const getNewOrderRequest = () => ({
  type: constants.GET_NEW_ORDER_REQUEST
});
export const getNewOrderSuccess = (payload: object) => ({
  type: constants.GET_NEW_ORDER_SUCCESS,
  payload
});
export const getNewOrderFailure = (payload: any) => ({
  type: constants.GET_NEW_ORDER_FAIL,
  payload
});

export const createAcknowledgeRequest = () => ({
  type: constants.CREATE_ACKNOWLEDGE_REQUEST
});
export const createAcknowledgeSuccess = () => ({
  type: constants.CREATE_ACKNOWLEDGE_SUCCESS
});
export const createAcknowledgeFailure = (payload: any) => ({
  type: constants.CREATE_ACKNOWLEDGE_FAIL,
  payload
});

export const deleteOrderPackageRequest = () => ({
  type: constants.DELETE_ORDER_PACKAGE_REQUEST
});
export const deleteOrderPackageSuccess = () => ({
  type: constants.DELETE_ORDER_PACKAGE_SUCCESS
});
export const deleteOrderPackageFailure = (payload: string) => ({
  type: constants.DELETE_ORDER_PACKAGE_FAIL,
  payload
});

export const createShipmentRequest = () => ({
  type: constants.CREATE_SHIPMENT_REQUEST
});
export const createShipmentSuccess = () => ({
  type: constants.CREATE_SHIPMENT_SUCCESS
});
export const createShipmentFailure = (payload: any) => ({
  type: constants.CREATE_SHIPMENT_FAIL,
  payload
});

export const verifyAddressRequest = () => ({
  type: constants.VERIFY_ADDRESS_REQUEST
});
export const verifyAddressSuccess = (payload: object) => ({
  type: constants.VERIFY_ADDRESS_SUCCESS,
  payload
});
export const verifyAddressFailure = (payload: any) => ({
  type: constants.VERIFY_ADDRESS_FAIL,
  payload
});

export const revertAddressRequest = () => ({
  type: constants.REVERT_ADDRESS_REQUEST
});
export const revertAddressSuccess = (payload: object) => ({
  type: constants.REVERT_ADDRESS_SUCCESS,
  payload
});
export const revertAddressFailure = (payload: any) => ({
  type: constants.REVERT_ADDRESS_FAIL,
  payload
});

export const revertShipFromAddressRequest = () => ({
  type: constants.REVERT_SHIP_FROM_ADDRESS_REQUEST
});
export const revertShipFromAddressSuccess = () => ({
  type: constants.REVERT_SHIP_FROM_ADDRESS_SUCCESS
});
export const revertShipFromAddressFailure = (payload: any) => ({
  type: constants.REVERT_SHIP_FROM_ADDRESS_FAIL,
  payload
});

export const deleteOrderItemPackagesRequest = () => ({
  type: constants.DELETE_ORDER_ITEM_PACKAGES_REQUEST
});
export const deleteOrderItemPackagesSuccess = () => ({
  type: constants.DELETE_ORDER_ITEM_PACKAGES_SUCCESS
});
export const deleteOrderItemPackagesFailure = (payload: string) => ({
  type: constants.DELETE_ORDER_ITEM_PACKAGES_FAIL,
  payload
});

export const createOrderItemPackagesRequest = () => ({
  type: constants.CREATE_ORDER_ITEM_PACKAGES_REQUEST
});
export const createOrderItemPackagesSuccess = () => ({
  type: constants.CREATE_ORDER_ITEM_PACKAGES_SUCCESS
});
export const createOrderItemPackagesFailure = (payload: string) => ({
  type: constants.CREATE_ORDER_ITEM_PACKAGES_FAIL,
  payload
});

export const updateOrderItemPackagesRequest = () => ({
  type: constants.UPDATE_ORDER_ITEM_PACKAGES_REQUEST
});
export const updateOrderItemPackagesSuccess = () => ({
  type: constants.UPDATE_ORDER_ITEM_PACKAGES_SUCCESS
});
export const updateOrderItemPackagesFailure = (payload: string) => ({
  type: constants.UPDATE_ORDER_ITEM_PACKAGES_FAIL,
  payload
});

export const createBoxPackageRequest = () => ({
  type: constants.CREATE_BOX_PACKAGE_REQUEST
});
export const createBoxPackageSuccess = () => ({
  type: constants.CREATE_BOX_PACKAGE_SUCCESS
});
export const createBoxPackageFailure = (payload: string) => ({
  type: constants.CREATE_BOX_PACKAGE_FAIL,
  payload
});

export const createBulkBoxPackageRequest = () => ({
  type: constants.CREATE_BULK_BOX_PACKAGE_REQUEST
});
export const createBulkBoxPackageSuccess = () => ({
  type: constants.CREATE_BULK_BOX_PACKAGE_SUCCESS
});
export const createBulkBoxPackageFailure = (payload: string) => ({
  type: constants.CREATE_BULK_BOX_PACKAGE_FAIL,
  payload
});

export const updateShipToRequest = () => ({
  type: constants.UPDATE_SHIP_TO_REQUEST
});
export const updateShipToSuccess = (payload: object) => ({
  type: constants.UPDATE_SHIP_TO_SUCCESS,
  payload
});
export const updateShipToFailure = (payload: string) => ({
  type: constants.UPDATE_SHIP_TO_FAIL,
  payload
});

export const resetPackageRequest = () => ({
  type: constants.GET_RESET_PACKAGE_REQUEST
});
export const resetPackageSuccess = () => ({
  type: constants.GET_RESET_PACKAGE_SUCCESS
});
export const resetPackageFailure = (payload: string) => ({
  type: constants.GET_RESET_PACKAGE_FAIL,
  payload
});

export const saveShipmentDetailRequest = () => ({
  type: constants.SAVE_SHIPMENT_DETAIL_REQUEST
});
export const saveShipmentDetailSuccess = (payload: object) => ({
  type: constants.SAVE_SHIPMENT_DETAIL_SUCCESS,
  payload
});
export const saveShipmentDetailFailure = (payload: string) => ({
  type: constants.SAVE_SHIPMENT_DETAIL_FAIL,
  payload
});

export const createAcknowledgeBulkRequest = () => ({
  type: constants.CREATE_ACKNOWLEDGE_BULK_REQUEST
});
export const createAcknowledgeBulkSuccess = () => ({
  type: constants.CREATE_ACKNOWLEDGE_BULK_SUCCESS
});
export const createAcknowledgeBulkFailure = (payload: string) => ({
  type: constants.CREATE_ACKNOWLEDGE_BULK_FAIL,
  payload
});

export const verifyBulkRequest = () => ({
  type: constants.VERIFY_ADD_BULK_REQUEST
});
export const verifyBulkSuccess = () => ({
  type: constants.VERIFY_ADD_BULK_SUCCESS
});
export const verifyBulkFailure = (payload: string) => ({
  type: constants.VERIFY_ADD_BULK_FAIL,
  payload
});

export const shipBulkRequest = () => ({
  type: constants.SHIP_BULK_REQUEST
});
export const shipBulkSuccess = () => ({
  type: constants.SHIP_BULK_SUCCESS
});
export const shipBulkFailure = (payload: string) => ({
  type: constants.SHIP_BULK_FAIL,
  payload
});

export const shipConfirmationRequest = () => ({
  type: constants.SHIP_CONFIRMATION_REQUEST
});
export const shipConfirmationSuccess = () => ({
  type: constants.SHIP_CONFIRMATION_SUCCESS
});
export const shipConfirmationFailure = (payload: string) => ({
  type: constants.SHIP_CONFIRMATION_FAIL,
  payload
});

export const invoiceConfirmationRequest = () => ({
  type: constants.INVOICE_CONFIRMATION_REQUEST
});
export const invoiceConfirmationSuccess = () => ({
  type: constants.INVOICE_CONFIRMATION_SUCCESS
});
export const invoiceConfirmationFailure = (payload: string) => ({
  type: constants.INVOICE_CONFIRMATION_FAIL,
  payload
});

export const updateShipFromRequest = () => ({
  type: constants.UPDATE_SHIP_FROM_REQUEST
});
export const updateShipFromSuccess = (payload: object) => ({
  type: constants.UPDATE_SHIP_FROM_SUCCESS,
  payload
});
export const updateShipFromFailure = (payload: string) => ({
  type: constants.UPDATE_SHIP_FROM_FAIL,
  payload
});

export const getShippingServiceRequest = () => ({
  type: constants.GET_SHIPPING_SERVICE_REQUEST
});
export const getShippingServiceSuccess = (payload: any[]) => ({
  type: constants.GET_SHIPPING_SERVICE_SUCCESS,
  payload
});
export const getShippingServiceFailure = (payload: string) => ({
  type: constants.GET_SHIPPING_SERVICE_FAIL,
  payload
});

export const byPassRequest = () => ({
  type: constants.BY_PASS_REQUEST
});
export const byPassFromSuccess = () => ({
  type: constants.BY_PASS_SUCCESS
});
export const byPassFailure = (payload: string) => ({
  type: constants.BY_PASS_FAIL,
  payload
});

export const getOrderDetailRequest = () => ({
  type: constants.GET_ORDER_DETAIL_REQUEST
});
export const getOrderDetailFromSuccess = (payload: object) => ({
  type: constants.GET_ORDER_DETAIL_SUCCESS,
  payload
});
export const getOrderDetailFailure = (payload: string) => ({
  type: constants.GET_ORDER_DETAIL_FAIL,
  payload
});

export const deleteBulkPackageRequest = () => ({
  type: constants.DELETE_BULK_PACKAGE_REQUEST
});
export const deleteBulkPackageSuccess = () => ({
  type: constants.DELETE_BULK_PACKAGE_SUCCESS
});
export const deleteBulkPackageFailure = (payload: string) => ({
  type: constants.DELETE_BULK_PACKAGE_FAIL,
  payload
});

export const updateBackOrderRequest = () => ({
  type: constants.UPDATE_BACK_ORDER_REQUEST
});
export const updateBackOrderSuccess = () => ({
  type: constants.UPDATE_BACK_ORDER_SUCCESS
});
export const updateBackOrderFailure = (payload: string) => ({
  type: constants.UPDATE_BACK_ORDER_FAIL,
  payload
});

export const updateWarehouseOrderRequest = () => ({
  type: constants.UPDATE_WAREHOUSE_ORDER_REQUEST
});
export const updateWarehouseOrderSuccess = () => ({
  type: constants.UPDATE_WAREHOUSE_ORDER_SUCCESS
});
export const updateWarehouseOrderFailure = () => ({
  type: constants.UPDATE_WAREHOUSE_ORDER_FAIL
});

export const createNoteRequest = () => ({
  type: constants.CREATE_NOTE_REQUEST
});
export const createNoteSuccess = () => ({
  type: constants.CREATE_NOTE_SUCCESS
});
export const createNoteFailure = () => ({
  type: constants.CREATE_NOTE_FAIL
});

export const updateNoteRequest = () => ({
  type: constants.UPDATE_NOTE_REQUEST
});
export const updateNoteSuccess = () => ({
  type: constants.UPDATE_NOTE_SUCCESS
});
export const updateNoteFailure = () => ({
  type: constants.UPDATE_NOTE_FAIL
});

export const deleteNoteRequest = () => ({
  type: constants.DELETE_NOTE_REQUEST
});
export const deleteNoteSuccess = () => ({
  type: constants.DELETE_NOTE_SUCCESS
});
export const deleteNoteFailure = () => ({
  type: constants.DELETE_NOTE_FAIL
});
