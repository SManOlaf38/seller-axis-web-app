'use client';

import clsx from 'clsx';
import { useCallback, useEffect } from 'react';

import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore as useStoreRetailerCarrier } from '@/app/(withHeader)/retailer-carriers/context/index';
import { useStore } from '../../context';
import { setOrderDetail } from '../../context/action';
import ConfigureShipment from '../components/ConfigureShipment';
import Cost from '../components/Cost';
import General from '../components/General';
import OrderItem from '../components/OrderItem';
import Package from '../components/Package';
import Recipient from '../components/Recipient';
import { Order, PayloadManualShip } from '../../interface';
import ManualShip from '../components/ManualShip';
import * as actions from '../../context/action';
import * as actionsRetailerCarrier from '@/app/(withHeader)/retailer-carriers/context/action';
import * as servicesRetailerCarrier from '@/app/(withHeader)/retailer-carriers/fetch';
import SubmitInvoice from '../components/SubmitInvoice';
import CancelOrder from '../components/CancelOrder';
import { Button } from '@/components/ui/Button';
import { createAcknowledgeService, createShipmentService, verifyAddressService } from '../../fetch';
import useSearch from '@/hooks/useSearch';
import usePagination from '@/hooks/usePagination';

export const InfoOrder = ({
  title,
  value,
  className
}: {
  title: string | React.ReactNode;
  value: string | number | React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={clsx(
        'grid w-full grid-cols-2 gap-2 border-b border-lightLine py-1 dark:border-iridium',
        className
      )}
    >
      <div className="text-sm font-medium">{title}</div>
      <div className="text-sm font-light">{value}</div>
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

  console.log('detail', detail);

  const {
    state: { orderDetail, isLoading, isLoadingAcknowledge, isLoadingVerify },
    dispatch
  } = useStore();

  const {
    state: { dataRetailerCarrier },
    dispatch: RetailerCarrier
  } = useStoreRetailerCarrier();

  const { dispatch: dispatchAlert } = useStoreAlert();

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
      await verifyAddressService(+orderDetail?.id);
      dispatch(actions.verifyAddressSuccess());
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
        ...data
      });
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
          message: 'Error',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

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
        <Button
          isLoading={isLoadingAcknowledge}
          disabled={isLoadingAcknowledge}
          color="bg-primary500"
          className={'flex items-center py-2  max-sm:hidden'}
          onClick={handleSubmitAcknowledge}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">Acknowledge</span>
          </div>
        </Button>
      </div>

      <div className="h-full">
        <div className="grid w-full grid-cols-3 gap-2">
          <div className="col-span-2 flex flex-col gap-2">
            <Package detail={detail} />
            <Recipient
              billTo={orderDetail.bill_to}
              customer={orderDetail.customer}
              shipTo={orderDetail.ship_to}
              onVerifyAddress={handleVerifyAddress}
              isLoadingVerify={isLoadingVerify}
            />
            <Cost />
            <OrderItem items={orderDetail.items} />
          </div>
          <div className="flex flex-col gap-2">
            <General orderDate={orderDetail.order_date} />
            <ConfigureShipment onShipment={handleCreateShipment} />
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
