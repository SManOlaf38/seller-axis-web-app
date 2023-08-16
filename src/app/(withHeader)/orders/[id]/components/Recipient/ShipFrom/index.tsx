import Autocomplete from '@/components/ui/Autocomplete';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { useStore as useStoreWarehouse } from '@/app/(withHeader)/warehouse/context';
import * as actionsWarehouse from '@/app/(withHeader)/warehouse/context/action';
import * as servicesWarehouse from '@/app/(withHeader)/warehouse/fetch/index';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import useSearch from '@/hooks/useSearch';

import { updateShipFromService } from '@/app/(withHeader)/orders/fetch';
import { Order } from '@/app/(withHeader)/orders/interface';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import ConfirmModal from '@/components/ui/ConfirmModal';
import useToggleModal from '@/hooks/useToggleModal';
import IconEdit from 'public/edit.svg';
import { schemaShipFrom } from '../../ConfigureShipment';
import { InfoOrder } from '../../InfoOrder';

const ShipFromComponent = ({
  isEditRecipient,
  handleToggleEdit,
  detail,
  handleGetOrderDetail
}: {
  isEditRecipient: {
    shipFrom: boolean;
    shipTo: boolean;
  };
  handleToggleEdit: (name: 'shipFrom' | 'shipTo') => () => void;
  detail: Order;
  isLoadingUpdateShipTo: boolean;
  handleGetOrderDetail: () => Promise<void>;
}) => {
  const {
    state: { dataRetailerWarehouse, isLoading },
    dispatch: dispatchWarehouse
  } = useStoreWarehouse();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const { openModal, handleToggleModal } = useToggleModal();

  const [warehouseLocation, setWarehouseLocation] = useState<any | null>();

  const defaultValues = useMemo(() => {
    return {
      address_1: '',
      address_2: '',
      city: '',
      country: '',
      phone: '',
      name: '',
      postal_code: '',
      state: '',
      company: ''
    };
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    reset,
    watch,
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

  const handleCreateRetailerWarehouse = handleSubmit(async () => {
    try {
      dispatchWarehouse(actionsWarehouse.createRetailerWarehouseRequest());
      await servicesWarehouse.createRetailerWarehouseService(getValues());
      await updateShipFromService(+detail?.id, {
        ...getValues(),
        contact_name: getValues().name
      });
      dispatchWarehouse(actionsWarehouse.createRetailerWarehouseSuccess());
      handleGetRetailerWarehouse();
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleToggleEdit('shipFrom');
      handleToggleModal();
    } catch (error: any) {
      dispatchWarehouse(actionsWarehouse.createRetailerWarehouseFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  });

  const handleUpdateRetailerWarehouse = handleSubmit(async () => {
    try {
      dispatchWarehouse(actionsWarehouse.updateRetailerWarehouseRequest());
      await servicesWarehouse.updateRetailerWarehouseService({
        ...getValues(),
        id: warehouseLocation?.id
      });
      await updateShipFromService(+detail?.id, {
        ...getValues(),
        contact_name: getValues().name
      });
      handleGetRetailerWarehouse();
      dispatchWarehouse(actionsWarehouse.updateRetailerWarehouseSuccess());
      handleGetOrderDetail();
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      handleToggleEdit('shipFrom');
      handleToggleModal();
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

  const handleSubmitShipTo = () => {
    handleToggleModal();
  };

  useEffect(() => {
    handleGetRetailerWarehouse();
  }, [handleGetRetailerWarehouse]);

  useEffect(() => {
    reset({
      ...warehouseLocation
    });
  }, [reset, warehouseLocation]);

  useEffect(() => {
    if (detail?.batch && detail?.batch.retailer.default_warehouse) {
      setWarehouseLocation({
        ...detail.batch.retailer.default_warehouse,
        label: detail?.batch?.retailer?.default_warehouse?.name,
        value: detail.batch.retailer.default_warehouse?.id
      });
    }
  }, [detail.batch]);

  return (
    <>
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
            <Button
              onClick={handleToggleEdit('shipFrom')}
              className="bg-gey100 dark:bg-gunmetal"
              startIcon={<IconEdit />}
            >
              Edit
            </Button>
          )
        }
        value={
          isEditRecipient.shipFrom ? (
            <form
              noValidate
              onSubmit={handleSubmit(handleSubmitShipTo)}
              className="grid w-full grid-cols-1 gap-2"
            >
              <div className="my-2">
                <div className="mb-3">
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <Input
                        {...field}
                        required
                        label="Name"
                        name="name"
                        error={errors.name?.message}
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
                        required
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
                    onClick={handleToggleEdit('shipFrom')}
                    className="bg-gey100 dark:bg-gunmetal"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleToggleModal} type="button" className="bg-primary500">
                    Save
                  </Button>
                </div>
              </div>
            </form>
          ) : (
            <div>
              <TextInfoRecipient
                title="Name"
                content={detail.batch.retailer.default_warehouse?.name || '-'}
              />
              <TextInfoRecipient
                title="Address 1"
                content={detail.batch.retailer.default_warehouse?.address_1 || '-'}
              />
              <TextInfoRecipient
                title="Address 2"
                content={detail.batch.retailer.default_warehouse?.address_2 || '-'}
              />
              <TextInfoRecipient
                title="City"
                content={detail.batch.retailer.default_warehouse?.city || '-'}
              />
              <TextInfoRecipient
                title="State"
                content={detail.batch.retailer.default_warehouse?.state || '-'}
              />
              <TextInfoRecipient
                title="Postal Code"
                content={detail.batch.retailer.default_warehouse?.postal_code || '-'}
              />
              <TextInfoRecipient
                title="Country"
                content={detail.batch.retailer.default_warehouse?.country || '-'}
              />
              <TextInfoRecipient
                title="Phone"
                content={detail.batch.retailer.default_warehouse?.phone || '-'}
              />
            </div>
          )
        }
      />
      <ConfirmModal
        loading={isLoading}
        title="Confirm"
        description="Do you want to update the current carrier or create a new carrier please confirm?"
        open={openModal}
        onClose={handleToggleModal}
        onCreate={handleCreateRetailerWarehouse}
        onUpdate={handleUpdateRetailerWarehouse}
      />
    </>
  );
};

export default ShipFromComponent;

const TextInfoRecipient = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="flex items-center">
      <p className="min-w-[160px] font-medium text-santaGrey">{title}:</p>
      <p className="font-normal">{content || '-'}</p>
    </div>
  );
};
