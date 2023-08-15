'use client';
import { useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { RetailerCarrier } from '@/app/(withHeader)/carriers/interface';
import Autocomplete from '@/components/ui/Autocomplete';
import { Button } from '@/components/ui/Button';
import CardToggle from '@/components/ui/CardToggle';
import { Input } from '@/components/ui/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import { Order } from '../../../interface';

export const dataServicesFedEx = [
  {
    label: 'PRIORITY_OVERNIGHT',
    value: 'PRIORITY_OVERNIGHT'
  }
];

export const dataServicesUPS = [
  {
    label: 'UPS ground',
    value: 'UPS ground'
  }
];

export const schemaShipment = yup.object().shape({
  carrier: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.string().nonNullable()
    })
    .required('Carrier is required'),
  shipping_service: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.string().nonNullable()
    })
    .required('Shipping services is required'),
  shipping_ref_1: yup.string().required('Reference #1 is required')
});

export const schemaShipTo = yup.object().shape({
  address_1: yup.string().required('Address 1 is required'),
  address_2: yup.string(),
  city: yup.string().required('City is required'),
  country: yup.string().required('Country is required'),
  day_phone: yup.string(),
  name: yup.string().required('Name is required'),
  postal_code: yup.string().required('Postal code is required'),
  state: yup.string().required('State is required'),
  addressFrom: yup.string().required('Address 1 is required'),
  cityFrom: yup.string().required('City is required'),
  countryFrom: yup.string().required('Country is required'),
  phoneFrom: yup.string().required('Phone 1 is required'),
  nameFrom: yup.string().required('Name is required'),
  postal_codeFrom: yup.string().required('Postal code is required'),
  stateFrom: yup.string().required('State is required')
});

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
  onShipment: (data: any) => void;
  dataRetailerCarrier: RetailerCarrier[];
  onGetRetailerCarrier: () => Promise<void>;
  detail: Order;
  isLoadingShipment: boolean;
  dataShippingService: any[];
  handleSearchService: any;
  handleChangeRetailerCarrier: any;
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
        ...detail
      });
      setValue('shipping_service', {
        value: detail?.shipping_service?.name,
        label: detail?.shipping_service?.code
      });
      setValue('carrier', { value: detail?.carrier?.id, label: detail?.carrier?.service?.name });
    }
  }, [detail, handleChangeRetailerCarrier, reset, setValue]);

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
                  label: item?.service.name,
                  service: item.service.id
                })) || []
              }
              required
              onChange={(data: any) => {
                setValue('carrier', data);
                handleChangeRetailerCarrier(data.service);
                setValue('shipping_service', null);
              }}
              label="Retailer carrier"
              name="carrier"
              placeholder="Select Retailer carrier"
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
              Boolean(!detail?.verified_ship_to?.id) ||
              detail?.status === ('Shipped' || 'Shipping')
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
