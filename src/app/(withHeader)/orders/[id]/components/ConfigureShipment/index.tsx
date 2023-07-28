'use client';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { RetailerCarrier } from '@/app/(withHeader)/retailer-carriers/interface';
import Autocomplete from '@/components/ui/Autocomplete';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import { Order } from '../../../interface';
import { Button } from '@/components/ui/Button';

export const dataServices = [
  {
    label: 'UPS ground',
    value: 'UPS ground'
  }
];

export const schemaShipment = yup.object().shape({
  carrier_id: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.string().nonNullable()
    })
    .required('Carrier is required'),
  services: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.string().nonNullable()
    })
    .required('Services is required'),
  shipping_ref_1: yup.string().required('Shipping ref 1 is required')
});

const ConfigureShipment = ({
  onShipment,
  dataRetailerCarrier,
  onGetRetailerCarrier,
  detail,
  isLoadingShipment
}: {
  onShipment: (data: any) => void;
  dataRetailerCarrier: RetailerCarrier[];
  onGetRetailerCarrier: () => Promise<void>;
  detail: Order;
  isLoadingShipment: boolean;
}) => {
  const defaultValues = useMemo(() => {
    if (detail) {
      return {
        carrier_id: null,
        services: null,
        shipping_ref_1: detail?.po_number || '',
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
    setError,
    getValues
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaShipment)
  });

  return (
    <CardToggle title="Configure Shipment" className="grid w-full grid-cols-1 gap-2">
      <form
        noValidate
        onSubmit={handleSubmit(onShipment)}
        className="grid w-full grid-cols-1 gap-2"
      >
        <Controller
          control={control}
          name="carrier_id"
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={
                dataRetailerCarrier?.map((item) => ({
                  value: item?.id,
                  label: item?.service.name
                })) || []
              }
              required
              label="Retailer carrier"
              name="carrier_id"
              placeholder="Select Retailer carrier"
              onReload={onGetRetailerCarrier}
              pathRedirect="/retailer-carriers/create"
              error={errors.carrier_id?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="services"
          render={({ field }) => (
            <Autocomplete
              {...field}
              options={dataServices}
              required
              label="Services"
              name="services"
              placeholder="Select Services"
              addNew={false}
              error={errors.services?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="shipping_ref_1"
          render={({ field }) => (
            <Input
              {...field}
              label="Reference Number #1"
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
              label="Reference Number #2"
              required
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
              label="Reference Number #3"
              required
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
              required
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
              required
              name="shipping_ref_5"
              error={errors.shipping_ref_5?.message}
            />
          )}
        />

        <div className="my-4 flex flex-col items-end">
          <Button
            disabled={isLoadingShipment}
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
