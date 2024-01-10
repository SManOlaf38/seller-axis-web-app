import { Control, Controller, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import Image from 'next/image';
import { ChangeEvent, useMemo } from 'react';
import { useParams } from 'next/navigation';

import { useStore as useStoreCarrier } from '@/app/(withHeader)/carriers/context';
import { useStore as useStoreWarehouse } from '@/app/(withHeader)/warehouse/context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import ReferenceRetailer from '../ReferenceRetailer';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import Icons from '@/components/Icons';
import Tooltip from '@/components/ui/Tooltip';
import Autocomplete from '@/components/ui/Autocomplete';
import { DataCountryRegion } from '@/constants';
import { DATA_TYPE, ListFieldSFTP, ListFieldShipFrom, ReferenceKey } from '../../constants';
import { hasMismatch } from '@/utils/utils';

import type { Gs1 } from '@/app/(withHeader)/gs1/interface';
import type { PayloadShipRefType, ShipRefType, ShipRefTypeResult } from '../../interface';
import FormField from '../FormField';

type SectionRetailer = {
  control: Control<any, any>;
  errors: FieldErrors<any>;
  isLoadingReloadCustomerQB: boolean;
  isLoadingCreate: boolean;
  dataShipRefType: PayloadShipRefType;
  dataGs1: Gs1[];
  valueReference: ShipRefType;
  watch: UseFormWatch<any>;
  onReloadQB: () => Promise<void>;
  setValue: UseFormSetValue<any>;
  handleSearchWarehouse: (
    e: ChangeEvent<HTMLInputElement>,
    searchPage?: boolean | undefined
  ) => void;
  handleGetRetailerWarehouse: () => Promise<void>;
  handleGetRetailerCarrier: () => Promise<void>;
  handleSelectRef: (item: ShipRefTypeResult, keyRef: ReferenceKey) => void;
  handleGetGs1: () => Promise<void>;
  handleSearchRetailerCarrier: (
    e: ChangeEvent<HTMLInputElement>,
    searchPage?: boolean | undefined
  ) => void;
  onChangeRef: (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
    referenceKey: string
  ) => void;
};

export default function SectionRetailer(props: SectionRetailer) {
  const {
    control,
    errors,
    isLoadingReloadCustomerQB,
    isLoadingCreate,
    dataShipRefType,
    dataGs1,
    valueReference,
    watch,
    onReloadQB,
    handleGetGs1,
    setValue,
    handleSearchWarehouse,
    handleGetRetailerWarehouse,
    handleGetRetailerCarrier,
    handleSelectRef,
    handleSearchRetailerCarrier,
    onChangeRef
  } = props;

  const params = useParams();
  const {
    state: { dataRetailerWarehouse }
  } = useStoreWarehouse();

  const {
    state: { dataRetailerCarrier }
  } = useStoreCarrier();

  const platform = watch('type');
  const shipping1 = watch('shipping_ref_1_value');
  const shipping2 = watch('shipping_ref_2_value');
  const shipping3 = watch('shipping_ref_3_value');
  const shipping4 = watch('shipping_ref_4_value');
  const shipping5 = watch('shipping_ref_5_value');

  const servicesShip = useMemo(() => {
    return dataShipRefType.results?.map((item: ShipRefTypeResult) => item?.name);
  }, [dataShipRefType.results]);

  const isValid = useMemo(() => {
    return (
      hasMismatch(shipping1, servicesShip) ||
      hasMismatch(shipping2, servicesShip) ||
      hasMismatch(shipping3, servicesShip) ||
      hasMismatch(shipping4, servicesShip) ||
      hasMismatch(shipping5, servicesShip)
    );
  }, [servicesShip, shipping1, shipping2, shipping3, shipping4, shipping5]);

  return (
    <div className="grid w-full grid-cols-4 gap-2">
      <div className="col-span-2 flex flex-col gap-2">
        <div className="grid w-full grid-cols-1 gap-4">
          <Card>
            <div className="flex w-full flex-col gap-4">
              <div>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={DATA_TYPE}
                      name="type"
                      label="Platforms"
                      required
                      error={errors.type?.message as string}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Name"
                      required
                      name="name"
                      placeholder="Enter name : ABC..."
                      error={errors.name?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="merchant_id"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Merchant ID"
                      required
                      name="merchant_id"
                      placeholder="Enter merchant ID"
                      error={errors.merchant_id?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="qbo_customer_ref_id"
                  render={({ field }) => (
                    <Input
                      {...field}
                      disabled
                      label="Quick books Customer ID"
                      name="qbo_customer_ref_id"
                      error={errors.qbo_customer_ref_id?.message}
                      endIcon={
                        <button
                          disabled={isLoadingReloadCustomerQB}
                          type="button"
                          onClick={onReloadQB}
                        >
                          <Icons glyph="refresh" />
                        </button>
                      }
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="vendor_id"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Vendor ID"
                      required
                      name="vendor_id"
                      placeholder="Enter Vendor ID : ABC..."
                      error={errors.vendor_id?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="remit_id"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={
                        <>
                          <p className="mr-1">Remit ID </p>
                          <Tooltip content="The entity to be paid. Often used to convey an account number for the entity in the merchant’s A/P system.">
                            <Image src="/question-icon.svg" width={16} height={16} alt="question" />
                          </Tooltip>
                        </>
                      }
                      required
                      name="remit_id"
                      placeholder="Enter Remit ID"
                      error={errors.remit_id?.message}
                    />
                  )}
                />
              </div>

              <div>
                <Controller
                  control={control}
                  name="default_warehouse"
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={[
                        {
                          label: 'None',
                          value: null
                        },
                        ...(dataRetailerWarehouse.results || [])?.map((item) => ({
                          label: item?.name,
                          value: item?.id
                        }))
                      ]}
                      handleChangeText={handleSearchWarehouse}
                      label="Default warehouse"
                      name="default_warehouse"
                      placeholder="Select default warehouse"
                      onReload={handleGetRetailerWarehouse}
                      pathRedirect="/warehouse/create"
                      setValueInputForm={setValue}
                      valueInputFrom="default_warehouse"
                      error={errors.default_warehouse?.message}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="default_carrier"
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={[
                        {
                          label: 'None',
                          value: null
                        },
                        ...(dataRetailerCarrier.results || [])?.map((item) => ({
                          label: `${item?.account_number} - Service: ${item?.service?.name} Shipper: ${item?.shipper?.name}`,
                          value: item?.id
                        }))
                      ]}
                      handleChangeText={handleSearchRetailerCarrier}
                      label="Default carrier"
                      name="default_carrier"
                      placeholder="Select default carrier"
                      onReload={handleGetRetailerCarrier}
                      pathRedirect="/carriers/create"
                      setValueInputForm={setValue}
                      valueInputFrom="default_carrier"
                      error={errors.default_carrier?.message}
                    />
                  )}
                />
              </div>
            </div>
          </Card>
        </div>
        <div className="col-span-2 flex flex-col gap-2">
          <div className="grid w-full grid-cols-1 gap-4">
            <Card>
              <Controller
                control={control}
                name="default_gs1"
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={[
                      {
                        label: 'None',
                        value: 0
                      },
                      ...(dataGs1 || [])?.map((item) => ({
                        label: item?.name,
                        value: item?.id
                      }))
                    ]}
                    label="Default GS1"
                    name="default_gs1"
                    placeholder="Select default GS1"
                    onReload={handleGetGs1}
                    pathRedirect="/gs1/create"
                    setValueInputForm={setValue}
                    valueInputFrom="default_gs1"
                    error={errors.default_gs1?.message}
                  />
                )}
              />
            </Card>
          </div>
        </div>
        <ReferenceRetailer
          valueReference={valueReference}
          handleSelectRef={handleSelectRef}
          errors={errors}
          control={control}
          servicesShip={servicesShip}
          watch={watch}
          onChangeRef={onChangeRef}
        />
      </div>
      <div className="col-span-2 flex flex-col gap-2">
        <div className="grid w-full grid-cols-1">
          <Card className="flex w-full flex-col gap-4">
            {ListFieldSFTP.map((field) => (
              <FormField
                key={field.name}
                control={control}
                name={field.name}
                label={field.label}
                placeholder={field.placeholder}
                required={field.required}
                error={errors[field.name]?.message}
                type={field.type}
                disabled={platform !== 'CommerceHub'}
              />
            ))}
          </Card>

          <Card className="mt-2">
            <p className="mb-4">Ship From</p>
            <div className="flex w-full flex-col gap-4">
              {ListFieldShipFrom.map((field) => (
                <FormField
                  key={field.name}
                  control={control}
                  name={field.name}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  options={field.options}
                  error={errors[field.name]?.message}
                  type={field.type}
                />
              ))}
            </div>
          </Card>
          <div className="my-[16px] flex justify-end">
            <Button
              type="submit"
              isLoading={isLoadingCreate}
              disabled={isLoadingCreate || isValid}
              className="bg-primary500"
            >
              {params?.id ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
