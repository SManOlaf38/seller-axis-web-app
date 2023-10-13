'use client';
import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useStoreGs1 } from '@/app/(withHeader)/gs1/context';
import { RetailerCarrier } from '@/app/(withHeader)/carriers/interface';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import usePagination from '@/hooks/usePagination';
import { yupResolver } from '@hookform/resolvers/yup';
import { Order, Shipment, ShippingService } from '../../../interface';
import { schemaShipment } from '../../../constants';
import { getGs1Failure, getGs1Request, getGs1Success } from '@/app/(withHeader)/gs1/context/action';
import { getGs1Service } from '@/app/(withHeader)/gs1/fetch';

const ConfigureShipment = ({
  onShipment,
  dataRetailerCarrier,
  onGetRetailerCarrier,
  detail,
  isLoadingShipment,
  dataShippingService,
  handleSearchService,
  handleChangeRetailerCarrier,
  handleChangeShippingService
}: {
  onShipment: (data: Shipment) => void;
  dataRetailerCarrier: RetailerCarrier[];
  onGetRetailerCarrier: () => Promise<void>;
  detail: Order;
  isLoadingShipment: boolean;
  dataShippingService: ShippingService[];
  handleSearchService: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeShippingService: (data: { label: string; value: string }) => void;
  handleChangeRetailerCarrier: (data: {
    label: string;
    service: number | string;
    value: number | string;
  }) => void;
}) => {
  const {
    state: { dataGs1 },
    dispatch: Gs1Dispatch
  } = useStoreGs1();
  const { page, rowsPerPage } = usePagination();

  const defaultGs1 = useMemo(() => {
    return dataGs1?.find((item) => +item?.id === (detail?.batch?.retailer?.default_gs1 as never));
  }, [dataGs1, detail?.batch?.retailer?.default_gs1]);

  const defaultValues = useMemo(() => {
    if (detail) {
      return {
        carrier: null,
        shipping_service: null,
        gs1: null,
        shipping_ref_1: '',
        shipping_ref_2: '',
        shipping_ref_3: '',
        shipping_ref_4: '',
        shipping_ref_5: ''
      };
    }
  }, [detail]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaShipment)
  });

  const dataHomeDelivery = useMemo(() => {
    return dataShippingService?.find((item) => item?.code === 'GROUND_HOME_DELIVERY');
  }, [dataShippingService]);

  useEffect(() => {
    if (
      detail?.verified_ship_to?.status === 'VERIFIED' &&
      detail?.verified_ship_to?.classification === 'RESIDENTIAL'
    ) {
      setValue('shipping_service', {
        label: dataHomeDelivery?.name || '',
        value: dataHomeDelivery?.code || ''
      });
    }
  }, [
    dataHomeDelivery,
    detail.verified_ship_to?.classification,
    detail?.verified_ship_to?.status,
    setValue
  ]);

  useEffect(() => {
    if (detail) {
      reset({
        carrier: {
          value: detail.batch.retailer.default_carrier?.id,
          label: `${detail.batch.retailer?.default_carrier?.account_number}-${detail.batch.retailer.default_carrier?.service?.name}`
        },
        shipping_service:
          detail?.verified_ship_to?.classification === 'RESIDENTIAL'
            ? {
                label: dataHomeDelivery?.name || '',
                value: dataHomeDelivery?.code || ''
              }
            : {
                label: detail?.batch?.retailer?.default_carrier?.default_service_type?.name,
                value: detail?.batch?.retailer?.default_carrier?.default_service_type?.code
              },
        gs1: {
          label: detail?.gs1?.name || defaultGs1?.name,
          value: detail?.gs1?.id || defaultGs1?.id
        },
        shipping_ref_1: detail?.shipping_ref_1,
        shipping_ref_2: detail?.shipping_ref_2,
        shipping_ref_3: detail?.shipping_ref_3,
        shipping_ref_4: detail?.shipping_ref_4,
        shipping_ref_5: detail?.shipping_ref_5
      });
      handleChangeRetailerCarrier({
        value: detail.batch.retailer.default_carrier?.id,
        label: `${detail.batch.retailer.default_carrier?.account_number}-${detail.batch.retailer.default_carrier?.service?.name}`,
        service: detail.batch.retailer.default_carrier?.service?.id
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail.carrier, detail.po_number, detail.batch, detail?.gs1, reset, defaultGs1]);

  const handleGetGs1 = useCallback(async () => {
    try {
      Gs1Dispatch(getGs1Request());
      const dataGs1 = await getGs1Service({
        search: '',
        page,
        rowsPerPage
      });
      Gs1Dispatch(getGs1Success(dataGs1));
    } catch (error: any) {
      Gs1Dispatch(getGs1Failure(error));
    }
  }, [Gs1Dispatch, page, rowsPerPage]);

  useEffect(() => {
    handleGetGs1();
  }, [handleGetGs1]);

  return (
    <CardToggle
      isShowContent={
        detail?.status === 'Opened' ||
        detail?.status === 'Acknowledged' ||
        detail?.status === 'Bypassed Acknowledge'
      }
      title="Configure Shipment"
      className="grid w-full grid-cols-1 gap-2"
    >
      <form
        noValidate
        onSubmit={handleSubmit(onShipment)}
        className="grid w-full grid-cols-1 gap-2"
      >
        <Controller
          control={control}
          name="carrier"
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={
                dataRetailerCarrier?.map((item) => ({
                  value: item?.id,
                  label: `${item.account_number}-${item?.service.name}`,
                  service: item.service.id
                })) || []
              }
              required
              onChange={(data: any) => {
                setValue('carrier', data);
                handleChangeRetailerCarrier(data);
                setValue('shipping_service', null);
              }}
              label="Carrier"
              name="carrier"
              placeholder="Select Carrier"
              onReload={onGetRetailerCarrier}
              pathRedirect="/carriers/create"
              error={errors.carrier?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="shipping_service"
          render={({ field }) => (
            <Autocomplete
              {...field}
              handleChangeText={handleSearchService}
              options={dataShippingService?.map((item) => ({
                label: item.name,
                value: item.code
              }))}
              required
              onChange={(data: { label: string; value: string }) => {
                setValue('shipping_service', data);
                handleChangeShippingService(data);
              }}
              label="Shipping service"
              name="shipping_service"
              placeholder="Select shipping service"
              addNew={false}
              error={errors.shipping_service?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="gs1"
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={
                dataGs1?.map((item) => ({
                  label: item?.name,
                  value: item?.id
                })) || []
              }
              label="GS1"
              name="gs1"
              placeholder="Select GS1"
              onReload={handleGetGs1}
              pathRedirect="/gs1/create"
              error={errors.gs1?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="shipping_ref_1"
          render={({ field }) => (
            <Input
              {...field}
              label={`Reference Number #1 (${
                detail?.batch?.retailer?.shipping_ref_1_type?.name || '-'
              })`}
              name="shipping_ref_1"
              error={errors.shipping_ref_1?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="shipping_ref_2"
          render={({ field }) => (
            <Input
              {...field}
              label={`Reference Number #2 (${
                detail?.batch?.retailer?.shipping_ref_2_type?.name || '-'
              })`}
              name="shipping_ref_2"
              error={errors.shipping_ref_2?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="shipping_ref_3"
          render={({ field }) => (
            <Input
              {...field}
              label={`Reference Number #3 (${
                detail?.batch?.retailer?.shipping_ref_3_type?.name || '-'
              })`}
              name="shipping_ref_3"
              error={errors.shipping_ref_3?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="shipping_ref_4"
          render={({ field }) => (
            <Input
              {...field}
              label={`Reference Number #4 (${
                detail?.batch?.retailer?.shipping_ref_4_type?.name || '-'
              })`}
              name="shipping_ref_4"
              error={errors.shipping_ref_4?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="shipping_ref_5"
          render={({ field }) => (
            <Input
              {...field}
              label={`Reference Number #5 (${
                detail?.batch?.retailer?.shipping_ref_5_type?.name || '-'
              })`}
              name="shipping_ref_5"
              error={errors.shipping_ref_5?.message}
            />
          )}
        />

        <div className="my-4 flex flex-col items-end">
          <Button
            disabled={
              isLoadingShipment ||
              (detail?.status !== 'Acknowledged' && detail?.status !== 'Bypassed Acknowledge')
            }
            isLoading={isLoadingShipment}
            className="bg-primary500 text-white"
          >
            Create Shipment
          </Button>
        </div>
      </form>
    </CardToggle>
  );
};

export default ConfigureShipment;
