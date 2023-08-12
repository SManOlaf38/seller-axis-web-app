'use client';

import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';

import * as actionsRetailerCarrier from '@/app/(withHeader)/retailer-carriers/context/action';
import { useStore as useStoreRetailerCarrier } from '@/app/(withHeader)/retailer-carriers/context/index';
import * as servicesRetailerCarrier from '@/app/(withHeader)/retailer-carriers/fetch';
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
  updateShipFromService,
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
import { checkTwoObjects } from '@/utils/utils';

const ShipConfirmation = dynamic(() => import('../components/ShipConfirmation'), {
  ssr: false
});

export const InfoOrder = ({
  title,
  value,
  className,
  classNameBorder,
  content
}: {
  title: string | React.ReactNode;
  value: string | number | React.ReactNode;
  className?: string;
  classNameBorder?: string;
  content?: JSX.Element;
}) => {
  return (
    <div className={clsx('border-b border-lightLine py-1 dark:border-iridium', classNameBorder)}>
      {content}
      <div className={clsx('', className)}>
        <div className="mb-[12px] text-sm font-semibold">{title}</div>
        <div className="text-sm font-light">{value}</div>
      </div>
    </div>
  );
};

export const headerTableWarehouse = [
  {
    id: 'merchant_sku',
    label: 'Merchant SKU'
  },
  {
    id: 'product_alias',
    label: 'Product alias'
  },
  {
    id: 'unit_cost',
    label: 'Unit cost'
  },
  {
    id: 'qty',
    label: 'QTY'
  }
];

const OrderDetailContainer = ({ detail }: { detail: Order }) => {
  const { search, debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const {
    state: {
      orderDetail,
      isLoading,
      isLoadingAcknowledge,
      isLoadingVerify,
      isLoadingShipment,
      isLoadingUpdateShipTo,
      isLoadingShipConfirmation
    },
    dispatch
  } = useStore();

  const {
    state: { dataRetailerCarrier },
    dispatch: RetailerCarrier
  } = useStoreRetailerCarrier();

  const { dispatch: dispatchAlert } = useStoreAlert();

  const [dataShipConfirmation, setDataShipConfirmation] = useState<ShipConfirmationType[]>([]);

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
        carrier_id: orderDetail?.carrier?.id as never,
        address_1: orderDetail?.ship_to?.address_1,
        address_2: orderDetail?.ship_to?.address_2,
        city: orderDetail?.ship_to?.city,
        company: orderDetail?.ship_to?.company,
        country: orderDetail?.ship_to?.country,
        phone: orderDetail?.customer?.day_phone,
        contact_name: orderDetail?.ship_to?.name,
        postal_code: orderDetail?.ship_to?.postal_code,
        state: orderDetail?.ship_to?.state,
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
      const res = await createShipmentService({
        ...data,
        id: +orderDetail?.id,
        carrier: +data.carrier.value,
        shipping_service: data.shipping_service.label
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

  const handleUpdateShip = async (data: UpdateShipTo) => {
    const bodyShipFrom = {
      address_1: data.addressFrom,
      address_2: data.address2From,
      city: data.cityFrom,
      company: data.companyFrom,
      country: data.countryFrom,
      phone: data.phoneFrom,
      contact_name: data.nameFrom,
      postal_code: data.postal_codeFrom,
      state: data.stateFrom,
      status: 'EDITED'
    };

    const bodyShipTo = {
      address_1: data.address_1,
      address_2: data.address_2,
      city: data.city,
      company: data.company,
      country: data.country,
      phone: data.day_phone,
      contact_name: data.name,
      postal_code: data.postal_code,
      state: data.state,
      status: 'EDITED'
    };

    const dataShipTo = {
      address_1: orderDetail.verified_ship_to?.address_1 || orderDetail.ship_to?.address_1,
      address_2: orderDetail.verified_ship_to?.address_2 || orderDetail.ship_to?.address_2,
      city: orderDetail.verified_ship_to?.city || orderDetail.ship_to?.city,
      company: orderDetail.verified_ship_to?.company || orderDetail.ship_to?.company,
      country: orderDetail.verified_ship_to?.country || orderDetail.ship_to?.country,
      phone: orderDetail.verified_ship_to?.phone || orderDetail.customer?.day_phone,
      contact_name: orderDetail.verified_ship_to?.name || orderDetail.customer?.name,
      postal_code: orderDetail.verified_ship_to?.postal_code || orderDetail.ship_to?.postal_code,
      state: orderDetail.verified_ship_to?.state || orderDetail.ship_to?.state,
      status: 'EDITED'
    };

    try {
      if (checkTwoObjects(bodyShipTo, dataShipTo)) {
        dispatch(actions.updateShipToRequest());
        await updateShipToService(+detail?.id, {
          ...bodyShipTo,
          carrier_id: orderDetail?.carrier?.id as never
        });
        dispatch(actions.updateShipToSuccess(data));
      }

      dispatch(actions.updateShipFromRequest());
      await updateShipFromService(+detail?.id, bodyShipFrom);
      dispatch(actions.updateShipFromSuccess(data));

      data.callback && data.callback();
      const dataOrder = await getOrderDetailServer(+detail?.id);
      dispatch(actions.setOrderDetail(dataOrder));
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
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
            {orderDetail.order_packages.length > 0 && (
              <ShipConfirmation detail={dataShipConfirmation} orderDetail={orderDetail} />
            )}
            {orderDetail.id && (
              <Recipient
                detail={orderDetail}
                onVerifyAddress={handleVerifyAddress}
                onUpdateShip={handleUpdateShip}
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
              isLoadingShipment={isLoadingShipment}
              detail={orderDetail}
              onGetRetailerCarrier={handleGetRetailerCarrier}
              dataRetailerCarrier={dataRetailerCarrier.results}
              onShipment={handleCreateShipment}
            />
            <ManualShip isLoading={isLoading} onCreateManualShip={handleCreateManualShip} />
            <SubmitInvoice isLoading={isLoading} onSubmitInvoice={handleSubmitInvoice} />
            <CancelOrder items={orderDetail.items} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderDetailContainer;
