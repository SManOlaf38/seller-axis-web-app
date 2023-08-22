'use client';
import { ChangeEvent, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { RetailerCarrier } from '@/app/(withHeader)/carriers/interface';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import { Order, Shipment, ShippingService } from '../../../interface';
import { schemaShipment } from '../../../constants';

const ConfigureShipment = ({
  onShipment,
  dataRetailerCarrier,
  onGetRetailerCarrier,
  detail,
  isLoadingShipment,
  dataShippingService,
  handleSearchService,
  handleChangeRetailerCarrier
}: {
  onShipment: (data: Shipment) => void;
  dataRetailerCarrier: RetailerCarrier[];
  onGetRetailerCarrier: () => Promise<void>;
  detail: Order;
  isLoadingShipment: boolean;
  dataShippingService: ShippingService[];
  handleSearchService: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeRetailerCarrier: (data: {
    label: string;
    service: number | string;
    value: number | string;
  }) => void;
}) => {
  const defaultValues = useMemo(() => {
    if (detail) {
      return {
        carrier: null,
        shipping_service: null,
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

  useEffect(() => {
    if (detail) {
      reset({
        carrier: {
          value: detail.batch.retailer.default_carrier?.id,
          label: `${detail.batch.retailer.default_carrier.account_number}-${detail.batch.retailer.default_carrier?.service?.name}`
        },
        shipping_service: {
          label: detail?.shipping_service?.name,
          value: detail?.shipping_service?.code
        },
        shipping_ref_1: detail.po_number,
        shipping_ref_2: '',
        shipping_ref_3: '',
        shipping_ref_4: '',
        shipping_ref_5: ''
      });
      handleChangeRetailerCarrier({
        value: detail.batch.retailer.default_carrier?.id,
        label: `${detail.batch.retailer.default_carrier.account_number}-${detail.batch.retailer.default_carrier?.service?.name}`,
        service: detail.batch.retailer.default_carrier.service.id
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail, reset]);

  return (
    <CardToggle title="Configure Shipment" className="grid w-full grid-cols-1 gap-2">
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
          name="shipping_ref_1"
          render={({ field }) => (
            <Input
              {...field}
              label="Reference Number #1 (PO number)"
              required
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
              label="Reference Number #2 (invoice No.)"
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
              label="Reference Number #3 (Department No.)"
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
              label="Reference Number #4"
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
              label="Reference Number #5"
              name="shipping_ref_5"
              error={errors.shipping_ref_5?.message}
            />
          )}
        />

        <div className="my-4 flex flex-col items-end">
          <Button
            disabled={
              isLoadingShipment ||
              detail?.status === 'Shipped' ||
              detail?.status === 'Shipping' ||
              detail?.status === 'Invoiced'
            }
            isLoading={isLoadingShipment}
            className="bg-primary500"
          >
            Shipment
          </Button>
        </div>
      </form>
    </CardToggle>
  );
};

export default ConfigureShipment;
