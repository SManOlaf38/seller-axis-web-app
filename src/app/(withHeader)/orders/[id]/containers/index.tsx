'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

import { useStore as useStoreOrg } from '@/app/(withHeader)/organizations/context';
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
  byPassService,
  cancelOrderService,
  createAcknowledgeService,
  createShipmentService,
  getInvoiceService,
  getNewOrderDetailService,
  getOrderDetailServer,
  getShippingService,
  revertAddressService,
  shipConfirmationService,
  updateShipToService,
  verifyAddressService
} from '../../fetch';
import { Order, PayloadManualShip, Shipment, UpdateShipTo } from '../../interface';
import CancelOrder from '../components/CancelOrder';
import ConfigureShipment from '../components/ConfigureShipment';
import Cost from '../components/Cost';
import General from '../components/General';
import ManualShip from '../components/ManualShip';
import OrderItem from '../components/OrderItem';
import Package from '../components/Package';
import Recipient from '../components/Recipient';
import SubmitInvoice from '../components/SubmitInvoice';
import Loading from '../loading';

dayjs.extend(utc);
dayjs.extend(timezone);

const ShipConfirmation = dynamic(() => import('../components/ShipConfirmation'), {
  ssr: false
});

const OrderDetailContainer = () => {
  const params = useParams();
  const {
    state: { organizations }
  } = useStoreOrg();
  const currentOrganization = Cookies.get('current_organizations');
  const currentLocalTime = dayjs().utc();
  const { debouncedSearchTerm, handleSearch } = useSearch();

  const { debouncedSearchTerm: debouncedSearchTermService, handleSearch: handleSearchService } =
    useSearch();

  const { page, rowsPerPage, onPageChange } = usePagination();
  const {
    state: {
      orderDetail,
      isLoadingAcknowledge,
      isLoadingVerify,
      isLoadingShipment,
      isLoadingUpdateShipTo,
      isLoadingShipConfirmation,
      dataShippingService,
      isLoadingCreateManualShip,
      isLoadingCreateInvoice,
      isLoadingRevert,
      isLoadingByPass,
      isLoading
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
  const [isResidential, setIsResidential] = useState<boolean>(false);

  const [isPrintAll, setIsPrintAll] = useState({
    packingSlip: false,
    barcode: false,
    label: false,
    gs1: false,
    all: false
  });

  const handleChangeIsPrintAll = (name: 'packingSlip' | 'barcode' | 'label' | 'gs1' | 'all') => {
    setIsPrintAll({
      ...isPrintAll,
      [name]: !isPrintAll[name]
    });
  };

  const handleChangeRetailerCarrier = (data: {
    label: string;
    service: number | string;
    value: number | string;
  }) => {
    setRetailerCarrier(data);
    setIsResidential(false);
    if (
      orderDetail?.verified_ship_to?.status === 'VERIFIED' &&
      orderDetail?.ship_from?.classification === 'RESIDENTIAL'
    ) {
      handleRevertAddress();
    }
  };

  const handleChangeShippingService = (data: { label: string; value: string }) => {
    if (
      orderDetail?.verified_ship_to?.status === 'VERIFIED' &&
      data?.value !== 'GROUND_HOME_DELIVERY' &&
      orderDetail?.ship_from?.classification === 'RESIDENTIAL'
    ) {
      handleRevertAddress();
      setIsResidential(false);
    } else if (data?.value === 'GROUND_HOME_DELIVERY') {
      setIsResidential(true);
    } else {
      setIsResidential(false);
    }
  };

  const handleRevertAddress = async () => {
    try {
      dispatch(actions.revertAddressRequest());
      const res = await revertAddressService(+orderDetail?.id, {
        carrier_id: orderDetail?.batch.retailer.default_carrier?.id as never,
        ...orderDetail?.verified_ship_to,
        status: 'UNVERIFIED'
      });
      dispatch(actions.revertAddressSuccess(res));
    } catch (error: any) {
      dispatch(actions.revertAddressFailure(error.message));
    }
  };

  const handleCreateManualShip = async (data: PayloadManualShip) => {
    try {
      dispatch(actions.createManualShipRequest());
      dispatch(actions.createManualShipSuccess(data));
    } catch (error: any) {
      dispatch(actions.createManualShipFailure(error.message));
    }
  };

  const handleGetInvoice = useCallback(async () => {
    try {
      dispatch(actions.createInvoiceQuickBookShipRequest());
      const res = await getInvoiceService();
      dispatch(actions.createInvoiceQuickBookShipSuccess());
      localStorage.setItem('order_id', params?.id as string);
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
  }, [dispatch, params?.id, dispatchAlert]);

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
              <div className="flex">
                <p className="flex">
                  Please click
                  <span
                    className="cursor-pointer px-1 text-dodgeBlue underline"
                    onClick={() => window.open(`/sftp/${res.sftp_id}`, '_blank')}
                  >
                    SFTP
                  </span>
                  to change or
                </p>
                <button
                  disabled={isLoadingByPass}
                  className="ml-[1px] whitespace-normal break-words text-dodgeBlue underline"
                  onClick={() => handleByPass()}
                >
                  Bypass
                </button>
              </div>
            ),
          customTimeHide: res.status === 'COMPLETED' ? 2000 : 6000
        })
      );
      const dataOrder = await getOrderDetailServer(+params?.id);
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

  const handleByPass = async () => {
    try {
      dispatch(actions.byPassRequest());
      await byPassService(+params?.id);
      dispatch(actions.byPassFromSuccess());
      const dataOrder = await getOrderDetailServer(+params?.id);
      dispatch(actions.setOrderDetail(dataOrder));
      dispatchAlert(
        openAlertMessage({
          message: 'ByPass Acknowledge Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.byPassFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'ByPass Acknowledge Fail',
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
        page,
        rowsPerPage: 100,
        service:
          +retailerCarrier.service ||
          (+orderDetail?.batch.retailer.default_carrier?.service?.id as never)
      });
      dispatch(actions.getShippingServiceSuccess(response.results));
    } catch (error: any) {
      dispatch(actions.getShippingServiceFailure(error.message));
    }
  }, [
    dispatch,
    debouncedSearchTermService,
    page,
    retailerCarrier.service,
    orderDetail?.batch.retailer.default_carrier?.service?.id
  ]);

  const handleGetRetailerCarrier = useCallback(async () => {
    try {
      RetailerCarrier(actionsRetailerCarrier.getRetailerCarrierRequest());
      const dataProduct = await servicesRetailerCarrier.getRetailerCarrierService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage: 100
      });
      RetailerCarrier(actionsRetailerCarrier.getRetailerCarrierSuccess(dataProduct));
    } catch (error) {
      RetailerCarrier(actionsRetailerCarrier.getRetailerCarrierFailure(error));
    }
  }, [RetailerCarrier, debouncedSearchTerm, page]);

  const handleVerifyAddress = async () => {
    try {
      if (orderDetail.id) {
        dispatch(actions.verifyAddressRequest());

        const res = await verifyAddressService(+orderDetail?.id, {
          ...orderDetail?.verified_ship_to,
          carrier_id: orderDetail?.batch?.retailer?.default_carrier?.id
            ? +orderDetail?.batch.retailer.default_carrier?.id
            : +retailerCarrier.value,
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
      }
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
      getOrderDetail();
      dispatch(actions.createShipmentSuccess());
      handleChangeIsPrintAll('all');
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
      const res = await updateShipToService(+params?.id, {
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
      const dataOrder = await getOrderDetailServer(+params?.id);
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

  const getOrderDetail = useCallback(async () => {
    try {
      dispatch(actions.getOrderDetailRequest());
      const response = await getNewOrderDetailService(+params?.id);
      dispatch(actions.getOrderDetailFromSuccess(response));
    } catch (error: any) {
      dispatch(actions.getOrderDetailFailure(error.message));
    }
  }, [dispatch, params?.id]);

  useEffect(() => {
    getOrderDetail();
  }, [getOrderDetail]);

  useEffect(() => {
    handleGetRetailerCarrier();
  }, [handleGetRetailerCarrier]);

  useEffect(() => {
    handleGetShippingService();
  }, [handleGetShippingService]);

  useEffect(() => {
    if (
      (currentOrganization &&
        dayjs(organizations[currentOrganization]?.qbo_refresh_token_exp_time)
          .utc()
          .isBefore(currentLocalTime)) ||
      (currentOrganization &&
        organizations[currentOrganization]?.qbo_refresh_token_exp_time === null)
    ) {
      dispatchAlert(
        openAlertMessage({
          color: 'warning',
          customTimeHide: 6000,
          action: (
            <div className="flex max-w-[374px] items-start pr-[20px]">
              {organizations[currentOrganization]?.qbo_refresh_token_exp_time === null ? (
                <span className="text-[16px] leading-6 text-white">
                  You have not login the QuickBooks account. Please click the{' '}
                  <span
                    className="cursor-pointer whitespace-normal break-words text-[16px] text-dodgeBlue underline"
                    onClick={handleGetInvoice}
                  >
                    LINK
                  </span>{' '}
                  to access your QuickBooks account to continue
                </span>
              ) : (
                <span className="text-[16px] leading-6 text-white">
                  Your QuickBooks access code has expired.
                  <br /> Kindly click the{' '}
                  <span
                    className="cursor-pointer whitespace-normal break-words text-[16px] text-dodgeBlue underline"
                    onClick={handleGetInvoice}
                  >
                    LINK
                  </span>{' '}
                  to sign in to QuickBooks once again
                </span>
              )}
            </div>
          )
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrganization, dispatchAlert, handleGetInvoice, organizations]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
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
                  orderDetail?.status === 'Cancelled' ||
                  orderDetail?.status === 'Bypassed Acknowledge'
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
                  <ShipConfirmation
                    isPrintAll={isPrintAll}
                    handleChangeIsPrintAll={handleChangeIsPrintAll}
                    orderDetail={orderDetail}
                  />
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
                    isResidential={isResidential}
                  />
                )}
                <Cost orderDetail={orderDetail} />
                <OrderItem
                  items={orderDetail.items}
                  retailer={orderDetail?.batch?.retailer as never}
                />
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
                  handleChangeShippingService={handleChangeShippingService}
                />
                <ManualShip
                  detail={orderDetail}
                  isLoading={isLoadingCreateManualShip}
                  onCreateManualShip={handleCreateManualShip}
                />
                <SubmitInvoice
                  isLoading={isLoadingCreateInvoice}
                  handleGetInvoice={handleGetInvoice}
                  orderDetail={orderDetail}
                />
                <CancelOrder items={orderDetail.items} detail={orderDetail} />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default OrderDetailContainer;
