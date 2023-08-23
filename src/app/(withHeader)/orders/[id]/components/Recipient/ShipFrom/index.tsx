import Autocomplete from '@/components/ui/Autocomplete';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useStore as useStoreWarehouse } from '@/app/(withHeader)/warehouse/context';
import * as actionsWarehouse from '@/app/(withHeader)/warehouse/context/action';
import * as servicesWarehouse from '@/app/(withHeader)/warehouse/fetch/index';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import useSearch from '@/hooks/useSearch';
import { schemaShipFrom } from '@/app/(withHeader)/orders/constants';
import { updateShipFromService } from '@/app/(withHeader)/orders/fetch';
import { Order } from '@/app/(withHeader)/orders/interface';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { InfoOrder } from '../../InfoOrder';

import IconEdit from 'public/edit.svg';
import IconRevert from 'public/revert.svg';

const ShipFromComponent = ({
  isEditRecipient,
  handleToggleEdit,
  detail,
  handleGetOrderDetail,
  isLoadingVerify,
  handleRevertAddressShipFrom
}: {
  isEditRecipient: {
    shipFrom: boolean;
    shipTo: boolean;
  };
  handleToggleEdit: (name: 'shipFrom' | 'shipTo') => void;
  detail: Order;
  isLoadingUpdateShipTo: boolean;
  handleGetOrderDetail: () => Promise<void>;
  handleRevertAddressShipFrom: (data: any) => Promise<void>;
  isLoadingVerify: boolean;
}) => {
  const {
    state: { dataRetailerWarehouse, isLoading },
    dispatch: dispatchWarehouse
  } = useStoreWarehouse();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const [warehouseLocation, setWarehouseLocation] = useState<any | null>();

  const defaultValues = {
    address_1: '',
    address_2: '',
    city: '',
    country: '',
    phone: '',
    contact_name: '',
    postal_code: '',
    state: '',
    company: ''
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    getValues
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaShipFrom)
  });

  const { debouncedSearchTerm, handleSearch } = useSearch();

  const handleGetRetailerWarehouse = useCallback(async () => {
    try {
      dispatchWarehouse(actionsWarehouse.getRetailerWarehouseRequest());
      const dataProduct = await servicesWarehouse.getRetailerWarehouseService({
        search: debouncedSearchTerm,
        page: 0
      });
      dispatchWarehouse(actionsWarehouse.getRetailerWarehouseSuccess(dataProduct));
    } catch (error) {
      dispatchWarehouse(actionsWarehouse.getRetailerWarehouseFailure(error));
    }
  }, [dispatchWarehouse, debouncedSearchTerm]);

  const handleUpdateRetailerWarehouse = handleSubmit(async (data) => {
    try {
      dispatchWarehouse(actionsWarehouse.updateRetailerWarehouseRequest());
      await updateShipFromService(+detail?.id, {
        ...data,
        status: 'EDITED'
      });
      dispatchWarehouse(actionsWarehouse.updateRetailerWarehouseSuccess());
      handleGetOrderDetail();
      handleToggleEdit('shipFrom');
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatchWarehouse(actionsWarehouse.updateRetailerWarehouseFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  });

  useEffect(() => {
    handleGetRetailerWarehouse();
  }, [handleGetRetailerWarehouse]);

  useEffect(() => {
    if (detail) {
      reset({
        ...detail.ship_from,
        company: ''
      });
    }
  }, [detail, detail.batch, detail.ship_from, reset]);

  return (
    <InfoOrder
      classNameBorder="border-none"
      className="mt-2 rounded-lg border border-lightLine p-4 dark:border-iridium"
      title={'Ship From'}
      subTitle={
        isEditRecipient.shipFrom ? (
          <div>
            <Autocomplete
              options={
                dataRetailerWarehouse.results?.map((item) => ({
                  ...item,
                  label: item?.name,
                  value: item?.id
                })) || []
              }
              value={warehouseLocation}
              onChange={(data: any) => {
                setWarehouseLocation(data);
                reset({
                  ...data,
                  contact_name: data.name,
                  company: ''
                });
              }}
              handleChangeText={handleSearch}
              required
              name="default_warehouse"
              placeholder="Select warehouse"
              onReload={handleGetRetailerWarehouse}
              pathRedirect="/warehouse/create"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              onClick={() => handleRevertAddressShipFrom(getValues())}
              color="bg-primary500"
              isLoading={isLoadingVerify}
              disabled={isLoadingVerify}
              startIcon={<IconRevert />}
              type="button"
            >
              Revert
            </Button>
            <Button
              onClick={() => handleToggleEdit('shipFrom')}
              className="bg-gey100 dark:bg-gunmetal"
              startIcon={<IconEdit />}
              type="button"
            >
              Edit
            </Button>
          </div>
        )
      }
      value={
        isEditRecipient.shipFrom ? (
          <form
            noValidate
            onSubmit={handleSubmit(handleUpdateRetailerWarehouse)}
            className="grid w-full grid-cols-1 gap-2"
          >
            <div className="my-2">
              <div className="mb-3">
                <Controller
                  control={control}
                  name="contact_name"
                  render={({ field }) => (
                    <Input
                      {...field}
                      required
                      label="Name"
                      name="contact_name"
                      error={errors.contact_name?.message}
                    />
                  )}
                />
              </div>

              <div className="mb-3">
                <Controller
                  control={control}
                  name="address_1"
                  render={({ field }) => (
                    <Input
                      {...field}
                      required
                      label="Address 1"
                      name="address_1"
                      error={errors.address_1?.message}
                    />
                  )}
                />
              </div>

              <div className="mb-3">
                <Controller
                  control={control}
                  name="address_2"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Address 2"
                      name="address_2"
                      error={errors.address_2?.message}
                    />
                  )}
                />
              </div>

              <div className="mb-3">
                <Controller
                  control={control}
                  name="city"
                  render={({ field }) => (
                    <Input
                      {...field}
                      required
                      label="City"
                      name="city"
                      error={errors.city?.message}
                    />
                  )}
                />
              </div>

              <div className="mb-3">
                <Controller
                  control={control}
                  name="state"
                  render={({ field }) => (
                    <Input
                      {...field}
                      required
                      label="State"
                      name="state"
                      error={errors.state?.message}
                    />
                  )}
                />
              </div>

              <div className="mb-3">
                <Controller
                  control={control}
                  name="postal_code"
                  render={({ field }) => (
                    <Input
                      {...field}
                      required
                      label="Postal code"
                      name="postal_code"
                      error={errors.postal_code?.message}
                    />
                  )}
                />
              </div>

              <div className="mb-3">
                <Controller
                  control={control}
                  name="country"
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="Example: US"
                      required
                      label="Country"
                      name="country"
                      error={errors.country?.message}
                    />
                  )}
                />
              </div>

              <div className="mb-3">
                <Controller
                  control={control}
                  name="phone"
                  render={({ field }) => (
                    <Input
                      {...field}
                      required
                      label="Phone number"
                      name="phone"
                      error={errors.phone?.message}
                    />
                  )}
                />
              </div>

              <div className="mb-3">
                <Controller
                  control={control}
                  name="company"
                  render={({ field }) => (
                    <Input
                      {...field}
                      label="Company"
                      name="company"
                      error={errors.company?.message}
                    />
                  )}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => handleToggleEdit('shipFrom')}
                  className="bg-gey100 dark:bg-gunmetal"
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isLoading}
                  disabled={isLoading}
                  type="submit"
                  className="bg-primary500"
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div>
            <TextInfoRecipient title="Name" content={detail.ship_from?.contact_name || '-'} />
            <TextInfoRecipient title="Address 1" content={detail.ship_from?.address_1 || '-'} />
            <TextInfoRecipient title="Address 2" content={detail.ship_from?.address_2 || '-'} />
            <TextInfoRecipient title="City" content={detail.ship_from?.city || '-'} />
            <TextInfoRecipient title="State" content={detail.ship_from?.state || '-'} />
            <TextInfoRecipient title="Postal Code" content={detail.ship_from?.postal_code || '-'} />
            <TextInfoRecipient title="Country" content={detail.ship_from?.country || '-'} />
            <TextInfoRecipient title="Phone" content={detail.ship_from?.phone || '-'} />
          </div>
        )
      }
    />
  );
};

export default ShipFromComponent;

const TextInfoRecipient = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="mb-[12px] flex items-center">
      <p className="min-w-[160px] font-medium text-santaGrey">{title}:</p>
      <p className="font-normal">{content || '-'}</p>
    </div>
  );
};
