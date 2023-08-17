'use client';

import { useCallback, useEffect, useState } from 'react';

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
  createShipmentService,
  getOrderDetailServer,
  getShippingService,
  updateShipToService,
  verifyAddressService
} from '../../fetch';
import { Order, PayloadManualShip, ShipConfirmationType, UpdateShipTo } from '../../interface';
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

const OrderDetailContainer = ({ detail }: { detail: Order }) => {
  const { debouncedSearchTerm, handleSearch } = useSearch();

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
      isLoadingCreateInvoice
    },
    dispatch
  } = useStore();

  const {
    state: { dataRetailerCarrier },
    dispatch: RetailerCarrier
  } = useStoreRetailerCarrier();

  const { dispatch: dispatchAlert } = useStoreAlert();

  const [dataShipConfirmation, setDataShipConfirmation] = useState<ShipConfirmationType[]>([]);
  const [retailerCarrier, setRetailerCarrier] = useState<any>();

  const handleChangeRetailerCarrier = (data: number) => {
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

  const handleSubmitInvoice = async (data: any) => {
    try {
      dispatch(actions.createInvoiceRequest());
      dispatch(actions.createInvoiceSuccess(data));
    } catch (error: any) {
      dispatch(actions.createInvoiceFailure(error.message));
    }
  };

  const handleSubmitAcknowledge = async () => {
    try {
      dispatch(actions.createAcknowledgeRequest());
      await createAcknowledgeService(+orderDetail?.id);
      dispatch(actions.createAcknowledgeSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
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
        service: retailerCarrier || detail?.carrier?.service?.id
      });
      dispatch(actions.getShippingServiceSuccess(response.results));
    } catch (error: any) {
      dispatch(actions.getShippingServiceFailure(error.message));
    }
  }, [dispatch, debouncedSearchTermService, retailerCarrier, detail?.carrier?.service?.id]);

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
        carrier_id: (orderDetail?.carrier?.id as never) || retailerCarrier,
        phone: orderDetail?.customer?.day_phone,
        status: 'VERIFIED'
      });
      dispatch(actions.verifyAddressSuccess(res.data));
      const dataOrder = await getOrderDetailServer(+detail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
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

  const handleCreateShipment = async (data: any) => {
    try {
      dispatch(actions.createShipmentRequest());
      await createShipmentService({
        id: +orderDetail?.id,
        carrier: +data.carrier.value,
        shipping_service: data.shipping_service.value,
        shipping_ref_1: data.shipping_ref_1,
        shipping_ref_2: data.shipping_ref_2,
        shipping_ref_3: data.shipping_ref_3,
        shipping_ref_4: data.shipping_ref_4,
        shipping_ref_5: data.shipping_ref_5
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
      await updateShipToService(+detail?.id, {
        ...data,
        phone: data.day_phone,
        carrier_id: (orderDetail?.carrier?.id as never) || retailerCarrier,
        status: 'EDITED'
      });
      dispatch(actions.updateShipToSuccess(data));
      const dataOrder = await getOrderDetailServer(+detail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
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

  const handleShipConfirmation = () => {};

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
            isLoading={isLoadingShipConfirmation}
            disabled={isLoadingShipConfirmation || dataShipConfirmation?.length === 0}
            color="bg-primary500"
            className="mr-4 flex items-center py-2 max-sm:hidden"
            onClick={handleShipConfirmation}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-white">Shipment Confirmation</span>
            </div>
          </Button>

          <Button
            isLoading={isLoadingAcknowledge}
            disabled={isLoadingAcknowledge || detail?.status === 'Acknowledged'}
            color="bg-primary500"
            className="flex items-center py-2  max-sm:hidden"
            onClick={handleSubmitAcknowledge}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-white">Acknowledge</span>
            </div>
          </Button>
        </div>
      </div>

      <div className="h-full">
        <div className="grid w-full grid-cols-3 gap-2">
          <div className="col-span-2 flex flex-col gap-2">
            <Package detail={orderDetail} />
            {orderDetail?.order_packages?.length > 0 && (
              <ShipConfirmation detail={dataShipConfirmation} orderDetail={orderDetail} />
            )}
            {orderDetail.id && (
              <Recipient
                detail={orderDetail}
                onVerifyAddress={handleVerifyAddress}
                onUpdateShipTo={handleUpdateShipTo}
                isLoadingVerify={isLoadingVerify}
                isLoadingUpdateShipTo={isLoadingUpdateShipTo}
              />
            )}

            <Cost />
            <OrderItem items={orderDetail.items} retailer={orderDetail?.batch?.retailer as never} />
          </div>
          <div className="flex flex-col gap-2">
            <General detail={detail} orderDate={orderDetail.order_date} />
            <ConfigureShipment
              handleSearchService={handleSearchService}
              dataShippingService={dataShippingService}
              isLoadingShipment={isLoadingShipment}
              detail={orderDetail}
              onGetRetailerCarrier={handleGetRetailerCarrier}
              dataRetailerCarrier={dataRetailerCarrier.results}
              onShipment={handleCreateShipment}
              handleChangeRetailerCarrier={handleChangeRetailerCarrier}
            />
            <ManualShip
              isLoading={isLoadingCreateManualShip}
              onCreateManualShip={handleCreateManualShip}
            />
            <SubmitInvoice
              isLoading={isLoadingCreateInvoice}
              onSubmitInvoice={handleSubmitInvoice}
            />
            <CancelOrder items={orderDetail.items} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailContainer;
