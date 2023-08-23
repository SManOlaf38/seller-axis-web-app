'use client';

import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

import * as actionsRetailerCarrier from '@/app/(withHeader)/carriers/context/action';
import { useStore as useStoreRetailerCarrier } from '@/app/(withHeader)/carriers/context/index';
import * as servicesRetailerCarrier from '@/app/(withHeader)/carriers/fetch';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { Button } from '@/components/ui/Button';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import dynamic from 'next/dynamic';
import { useStore } from '../../context';
import * as actions from '../../context/action';
import { setOrderDetail } from '../../context/action';
import {
  createAcknowledgeService,
  createInvoiceService,
  createShipmentService,
  getInvoiceService,
  getOrderDetailServer,
  getShippingService,
  refreshTokenService,
  shipConfirmationService,
  updateShipToService,
  verifyAddressService
} from '../../fetch';
import {
  Order,
  PayloadManualShip,
  ShipConfirmationType,
  Shipment,
  UpdateShipTo
} from '../../interface';
import CancelOrder from '../components/CancelOrder';
import ConfigureShipment from '../components/ConfigureShipment';
import Cost from '../components/Cost';
import General from '../components/General';
import ManualShip from '../components/ManualShip';
import OrderItem from '../components/OrderItem';
import Package from '../components/Package';
import Recipient from '../components/Recipient';
import SubmitInvoice from '../components/SubmitInvoice';

const ShipConfirmation = dynamic(() => import('../components/ShipConfirmation'), {
  ssr: false
});

const OrderDetailContainer = ({
  detail,
  access_token_invoice,
  refresh_token_invoice
}: {
  detail: Order;
  access_token_invoice?: string;
  refresh_token_invoice?: string;
}) => {
  const { debouncedSearchTerm, handleSearch } = useSearch();
  const realm_id = localStorage.getItem('realm_id');

  const { debouncedSearchTerm: debouncedSearchTermService, handleSearch: handleSearchService } =
    useSearch();

  const { page, rowsPerPage, onPageChange } = usePagination();
  const {
    state: {
      orderDetail,
      isLoading,
      isLoadingAcknowledge,
      isLoadingVerify,
      isLoadingShipment,
      isLoadingUpdateShipTo,
      isLoadingShipConfirmation,
      dataShippingService,
      isLoadingCreateManualShip,
      isLoadingCreateInvoice,
      isLoadingRevert
    },
    dispatch
  } = useStore();

  const {
    state: { dataRetailerCarrier },
    dispatch: RetailerCarrier
  } = useStoreRetailerCarrier();

  const { dispatch: dispatchAlert } = useStoreAlert();

  const [retailerCarrier, setRetailerCarrier] = useState<{
    label: string;
    service: number | string;
    value: number | string;
  }>({ label: '', service: '', value: '' });

  const handleChangeRetailerCarrier = (data: {
    label: string;
    service: number | string;
    value: number | string;
  }) => {
    setRetailerCarrier(data);
  };

  const handleCreateManualShip = async (data: PayloadManualShip) => {
    try {
      dispatch(actions.createManualShipRequest());
      dispatch(actions.createManualShipSuccess(data));
    } catch (error: any) {
      dispatch(actions.createManualShipFailure(error.message));
    }
  };

  const onInvoice = async (token: string) => {
    try {
      if (realm_id) {
        dispatch(actions.createInvoiceRequest());
        await createInvoiceService(+orderDetail?.id, {
          access_token: token,
          realm_id
        });
        dispatch(actions.createInvoiceSuccess());
        const dataOrder = await getOrderDetailServer(+detail?.id);
        dispatch(actions.setOrderDetail(dataOrder));
        dispatchAlert(
          openAlertMessage({
            message: 'Submit Invoice Successfully',
            color: 'success',
            title: 'Success'
          })
        );
      }
    } catch (error: any) {
      if (error?.message === 'Access token has expired!') {
        refreshTokenInvoice();
      } else {
        dispatch(actions.createInvoiceFailure(error.message));
        dispatchAlert(
          openAlertMessage({
            message: error?.message,
            color: 'error',
            title: 'Fail'
          })
        );
        localStorage.removeItem('realm_id');
        Cookies.remove('access_token_invoice');
        Cookies.remove('refresh_token_invoice');
      }
    }
  };

  const handleGetInvoice = async () => {
    try {
      dispatch(actions.createInvoiceQuickBookShipRequest());
      const res = await getInvoiceService();
      dispatch(actions.createInvoiceQuickBookShipSuccess());
      localStorage.setItem('order_id', orderDetail?.id as string);
      window.open(res?.auth_url, '_self');
    } catch (error: any) {
      dispatch(actions.createInvoiceQuickBookShipFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error?.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const refreshTokenInvoice = async () => {
    try {
      dispatch(actions.refreshTokenInvoiceRequest());
      const res = await refreshTokenService({ refresh_token: refresh_token_invoice as never });
      dispatch(actions.refreshTokenInvoiceSuccess());

      if (res?.access_token) {
        Cookies.set('access_token_invoice', res?.access_token);
        onInvoice(res?.access_token);
      }
    } catch (error: any) {
      localStorage.removeItem('realm_id');
      Cookies.remove('access_token_invoice');
      Cookies.remove('refresh_token_invoice');

      dispatch(actions.refreshTokenInvoiceFailure(error.message));
    }
  };

  const handleSubmitAcknowledge = async () => {
    try {
      dispatch(actions.createAcknowledgeRequest());
      const res = await createAcknowledgeService(+orderDetail?.id);
      dispatch(actions.createAcknowledgeSuccess());
      dispatchAlert(
        openAlertMessage({
          message:
            res.status === 'COMPLETED'
              ? 'Acknowledge Successfully'
              : res?.data?.error?.default_code,
          color: res.status === 'COMPLETED' ? 'success' : 'error',
          title:
            res.status === 'COMPLETED' ? (
              'Success'
            ) : (
              <p className="flex">
                Please click
                <span
                  className="cursor-pointer px-1 text-dodgeBlue underline"
                  onClick={() => window.open(`/sftp/${res.sftp_id}`, '_blank')}
                >
                  SFTP
                </span>
                to change
              </p>
            ),
          customTimeHide: res.status === 'COMPLETED' ? 2000 : 6000
        })
      );
      const dataOrder = await getOrderDetailServer(+orderDetail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
    } catch (error: any) {
      dispatch(actions.createAcknowledgeFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: 'Error',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetShippingService = useCallback(async () => {
    try {
      dispatch(actions.getShippingServiceRequest());
      const response = await getShippingService({
        search: debouncedSearchTermService,
        service:
          +retailerCarrier.service ||
          (+detail?.batch.retailer.default_carrier?.service?.id as never)
      });
      dispatch(actions.getShippingServiceSuccess(response.results));
    } catch (error: any) {
      dispatch(actions.getShippingServiceFailure(error.message));
    }
  }, [
    dispatch,
    debouncedSearchTermService,
    retailerCarrier.service,
    detail?.batch.retailer.default_carrier?.service?.id
  ]);

  const handleGetRetailerCarrier = useCallback(async () => {
    try {
      RetailerCarrier(actionsRetailerCarrier.getRetailerCarrierRequest());
      const dataProduct = await servicesRetailerCarrier.getRetailerCarrierService({
        search: debouncedSearchTerm,
        page
      });
      RetailerCarrier(actionsRetailerCarrier.getRetailerCarrierSuccess(dataProduct));
    } catch (error) {
      RetailerCarrier(actionsRetailerCarrier.getRetailerCarrierFailure(error));
    }
  }, [RetailerCarrier, page, debouncedSearchTerm]);

  const handleVerifyAddress = async () => {
    try {
      dispatch(actions.verifyAddressRequest());
      const res = await verifyAddressService(+orderDetail?.id, {
        ...orderDetail?.ship_to,
        carrier_id:
          (orderDetail?.batch.retailer.default_carrier.id as never) || retailerCarrier.value,
        phone: orderDetail?.ship_to?.day_phone as never,
        contact_name: orderDetail?.ship_to?.name,
        status: 'VERIFIED'
      });
      dispatch(actions.verifyAddressSuccess(res));
      dispatchAlert(
        openAlertMessage({
          message: 'Verify successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.verifyAddressFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'verify Error',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleCreateShipment = async (data: Shipment) => {
    try {
      dispatch(actions.createShipmentRequest());
      await createShipmentService({
        ...data,
        id: +orderDetail?.id,
        carrier: +data.carrier.value,
        shipping_service: data.shipping_service.value,
        gs1: data?.gs1?.value
      });
      const dataOrder = await getOrderDetailServer(+detail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
      dispatch(actions.createShipmentSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.createShipmentFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'Error',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleUpdateShipTo = async (data: UpdateShipTo, callback: () => void) => {
    try {
      dispatch(actions.updateShipToRequest());
      const res = await updateShipToService(+detail?.id, {
        ...data,
        phone: data.day_phone,
        carrier_id:
          (orderDetail?.batch.retailer.default_carrier?.id as never) || retailerCarrier.value,
        status: 'EDITED'
      });
      dispatch(actions.updateShipToSuccess(res));
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      callback();
    } catch (error: any) {
      dispatch(actions.updateShipToFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: 'Error',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleShipConfirmation = async () => {
    try {
      dispatch(actions.shipConfirmationRequest());
      await shipConfirmationService(+orderDetail?.id);
      dispatch(actions.shipConfirmationSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Ship Confirmation Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      const dataOrder = await getOrderDetailServer(+orderDetail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
    } catch (error: any) {
      dispatch(actions.shipConfirmationFailure(error?.message));
      dispatchAlert(
        openAlertMessage({
          message: error?.message || 'Ship Confirmation Error',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleInvoiceConfirmation = () => {};

  useEffect(() => {
    dispatch(setOrderDetail(detail));
  }, [detail, dispatch]);

  useEffect(() => {
    handleGetRetailerCarrier();
  }, [handleGetRetailerCarrier]);

  useEffect(() => {
    handleGetShippingService();
  }, [handleGetShippingService]);

  return (
    <main className="relative mb-2">
      <div className="flex items-center justify-between">
        <h2 className="my-4 text-lg font-semibold">Purchase Order: #{orderDetail.po_number}</h2>

        <div className="flex items-center">
          <Button
            isLoading={isLoadingAcknowledge}
            disabled={isLoadingAcknowledge || orderDetail?.status !== 'Opened'}
            color="bg-primary500"
            className="mr-4 flex items-center  py-2 max-sm:hidden"
            onClick={handleSubmitAcknowledge}
          >
            Acknowledge
          </Button>

          <Button
            isLoading={isLoadingShipConfirmation}
            disabled={
              isLoadingShipConfirmation ||
              orderDetail?.status === 'Opened' ||
              orderDetail?.status === 'Acknowledged' ||
              orderDetail?.status === 'Shipment Confirmed' ||
              orderDetail?.status === 'Cancelled'
            }
            color="bg-primary500"
            className="mr-4 flex items-center py-2 max-sm:hidden"
            onClick={handleShipConfirmation}
          >
            Shipment Confirmation
          </Button>

          <Button
            disabled={orderDetail?.status !== 'Invoiced'}
            color="bg-primary500"
            className="flex items-center py-2 max-sm:hidden"
            onClick={handleInvoiceConfirmation}
          >
            Invoice Confirmation
          </Button>
        </div>
      </div>

      <div className="h-full">
        <div className="grid w-full grid-cols-3 gap-2">
          <div className="col-span-2 flex flex-col gap-2">
            <Package detail={orderDetail} />
            {orderDetail?.order_packages?.length > 0 && (
              <ShipConfirmation orderDetail={orderDetail} />
            )}
            {orderDetail.id && (
              <Recipient
                retailerCarrier={retailerCarrier}
                detail={orderDetail}
                onVerifyAddress={handleVerifyAddress}
                onUpdateShipTo={handleUpdateShipTo}
                isLoadingVerify={isLoadingVerify}
                isLoadingRevert={isLoadingRevert}
                isLoadingUpdateShipTo={isLoadingUpdateShipTo}
              />
            )}

            <Cost />
            <OrderItem items={orderDetail.items} retailer={orderDetail?.batch?.retailer as never} />
          </div>
          <div className="flex flex-col gap-2">
            <General detail={orderDetail} orderDate={orderDetail.order_date} />
            <ConfigureShipment
              dataShippingService={dataShippingService}
              isLoadingShipment={isLoadingShipment}
              detail={orderDetail}
              dataRetailerCarrier={dataRetailerCarrier.results}
              onGetRetailerCarrier={handleGetRetailerCarrier}
              handleSearchService={handleSearchService}
              onShipment={handleCreateShipment}
              handleChangeRetailerCarrier={handleChangeRetailerCarrier}
            />
            <ManualShip
              detail={orderDetail}
              isLoading={isLoadingCreateManualShip}
              onCreateManualShip={handleCreateManualShip}
            />
            <SubmitInvoice
              isLoading={isLoadingCreateInvoice}
              onInvoice={onInvoice}
              handleGetInvoice={handleGetInvoice}
              realm_id={realm_id}
              access_token_invoice={access_token_invoice}
              orderDetail={orderDetail}
            />
            <CancelOrder items={orderDetail.items} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailContainer;
