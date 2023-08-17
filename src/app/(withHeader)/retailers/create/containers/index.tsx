'use client';

import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';

import { useStore } from '@/app/(withHeader)/retailers/context';
import * as actions from '@/app/(withHeader)/retailers/context/action';
import * as services from '@/app/(withHeader)/retailers/fetch';
import { DATA_TYPE, schemaRetailer } from '../../constants';
import { CreateRetailer } from '../../interface';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import usePagination from '@/hooks/usePagination';
import Alert from '@/components/ui/Alert';
import Autocomplete from '@/components/ui/Autocomplete';
import { useStore as useStoreCarrier } from '@/app/(withHeader)/carriers/context';
import { useStore as useStoreWarehouse } from '@/app/(withHeader)/warehouse/context';
import * as actionsRetailerCarrier from '@/app/(withHeader)/carriers/context/action';
import * as servicesRetailerCarrier from '@/app/(withHeader)/carriers/fetch';
import * as actionsWarehouse from '@/app/(withHeader)/warehouse/context/action';
import * as servicesWarehouse from '@/app/(withHeader)/warehouse/fetch';
import useSearch from '@/hooks/useSearch';

const NewRetailerContainer = () => {
  const router = useRouter();
  const { page } = usePagination();
  const params = useParams();
  const {
    state: { isLoadingCreate, detailRetailer, errorMessage, dataSFTP },
    dispatch
  } = useStore();

  const {
    state: { dataRetailerCarrier },
    dispatch: dispatchRetailerCarrier
  } = useStoreCarrier();

  const {
    state: { dataRetailerWarehouse },
    dispatch: dispatchWarehouse
  } = useStoreWarehouse();

  const {
    debouncedSearchTerm: debouncedSearchTermRetailerCarrier,
    handleSearch: handleSearchRetailerCarrier
  } = useSearch();

  const { debouncedSearchTerm: debouncedSearchTermWarehouse, handleSearch: handleSearchWarehouse } =
    useSearch();

  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  const handleSuccessAlertClose = () => setShowSuccessAlert(false);

  const defaultValues = {
    name: '',
    type: 'CommerceHub',
    merchant_id: '',
    qbo_customer_ref_id: '',
    vendor_id: '',
    default_carrier: null,
    default_warehouse: null,

    retailer: '',
    sftp_host: '',
    sftp_username: '',
    sftp_password: ''
  };

  const {
    control,
    setValue,
    formState: { errors },
    handleSubmit,
    watch,
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaRetailer)
  });
  const platform = watch('type');

  const sftp_host = watch('sftp_host');
  const sftp_username = watch('sftp_username');
  const sftp_password = watch('sftp_password');

  const handleCreateRetailer = async (data: CreateRetailer) => {
    try {
      if (params?.id) {
        dispatch(actions.updateRetailerRequest());
        await services.updateRetailerService(
          {
            ...data,
            default_warehouse: +data.default_warehouse?.value,
            default_carrier: +data.default_carrier.value
          },
          params?.id.toString()
        );
        dispatch(actions.updateRetailerSuccess());
        setShowSuccessAlert(true);

        if (sftp_host && sftp_username && sftp_password) {
          if (dataSFTP?.results?.length === 0) {
            dispatch(actions.createRetailerRequest());
            await services.createSFTPService({
              ...data,
              retailer: +params?.id,
              id: data.id
            });
            dispatch(actions.createRetailerSuccess());
          } else {
            dispatch(actions.updateSFTPRequest());
            await services.updateSFTPService({
              ...data,
              retailer: +params?.id,
              default_warehouse: +data.default_warehouse?.value,
              default_carrier: +data.default_carrier.value,
              id: data.id
            });
            dispatch(actions.updateSFTPSuccess());
          }
        }

        router.push('/retailers');
      } else {
        dispatch(actions.createRetailerRequest());
        const response = await services.createRetailerService({
          name: data.name,
          type: data.type,
          merchant_id: data.merchant_id,
          qbo_customer_ref_id: data.qbo_customer_ref_id,
          vendor_id: data.vendor_id,
          default_warehouse: +data.default_warehouse?.value,
          default_carrier: +data.default_carrier.value
        });
        dispatch(actions.createRetailerSuccess());
        setShowSuccessAlert(true);

        if (sftp_host && sftp_username && sftp_password) {
          dispatch(actions.createSFTPRequest());
          await services.createSFTPService({
            sftp_host: data.sftp_host,
            sftp_username: data.sftp_username,
            sftp_password: data.sftp_password,
            retailer: response?.id,
            id: data.id
          });
          dispatch(actions.createSFTPSuccess());
        }

        router.push('/retailers');
      }
    } catch (error: any) {
      if (params?.id) {
        dispatch(actions.updateRetailerFailure(error.message));
        dispatch(actions.updateSFTPFailure(error));
        if (dataSFTP?.results?.length === 0) {
          dispatch(actions.createSFTPFailure(error));
        }
      } else {
        dispatch(actions.createRetailerFailure(error.message));
        dispatch(actions.createSFTPFailure(error));
      }
    }
  };

  const getDetailRetailer = async () => {
    try {
      dispatch(actions.getDetailRetailerRequest());
      const response = await services.getDetailRetailerService(+params?.id);
      dispatch(actions.getDetailRetailerSuccess(response));
    } catch (error: any) {
      dispatch(actions.getDetailRetailerFailure(error.message));
    }
  };

  const handleGetSFTP = useCallback(async () => {
    try {
      dispatch(actions.getSFTPRequest());
      const responseSftp = await services.getSFTPService({
        search: params?.id.toString(),
        page
      });
      dispatch(actions.getSFTPSuccess(responseSftp));
    } catch (error) {
      dispatch(actions.getSFTPFailure(error));
    }
  }, [dispatch, page, params?.id]);

  const handleGetRetailerWarehouse = useCallback(async () => {
    try {
      dispatchWarehouse(actionsWarehouse.getRetailerWarehouseRequest());
      const dataProduct = await servicesWarehouse.getRetailerWarehouseService({
        search: debouncedSearchTermWarehouse,
        page
      });
      dispatchWarehouse(actionsWarehouse.getRetailerWarehouseSuccess(dataProduct));
    } catch (error) {
      dispatchWarehouse(actionsWarehouse.getRetailerWarehouseFailure(error));
    }
  }, [dispatchWarehouse, page, debouncedSearchTermWarehouse]);

  const handleGetRetailerCarrier = useCallback(async () => {
    try {
      dispatchRetailerCarrier(actionsRetailerCarrier.getRetailerCarrierRequest());
      const dataProduct = await servicesRetailerCarrier.getRetailerCarrierService({
        search: debouncedSearchTermRetailerCarrier,
        page
      });
      dispatchRetailerCarrier(actionsRetailerCarrier.getRetailerCarrierSuccess(dataProduct));
    } catch (error) {
      dispatchRetailerCarrier(actionsRetailerCarrier.getRetailerCarrierFailure(error));
    }
  }, [dispatchRetailerCarrier, page, debouncedSearchTermRetailerCarrier]);

  useEffect(() => {
    handleGetRetailerWarehouse();
  }, [handleGetRetailerWarehouse]);

  useEffect(() => {
    handleGetRetailerCarrier();
  }, [handleGetRetailerCarrier]);

  useEffect(() => {
    handleGetSFTP();
  }, [handleGetSFTP]);

  useEffect(() => {
    params?.id && getDetailRetailer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  useEffect(() => {
    const detailRetailerSFTP = dataSFTP?.results?.[0];
    if (detailRetailer && params?.id) {
      reset({
        ...detailRetailer,
        ...detailRetailerSFTP,
        default_warehouse: {
          label: detailRetailer?.name,
          value: detailRetailer?.id
        },
        default_carrier: {
          label: detailRetailer.default_carrier?.account_number,
          value: detailRetailer.default_carrier?.id,
          description: `- Retailer: ${detailRetailer.default_carrier?.retailer?.name}-
          Service: ${detailRetailer.default_carrier?.service?.name} -
          Shipper: ${detailRetailer.default_carrier?.shipper?.name}`
        }
      });
    }
  }, [dataSFTP?.results, detailRetailer, params?.id, reset]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">
        {params?.id ? 'Update Retailer' : 'Create Retailer'}
      </h2>
      <div>
        <form
          noValidate
          onSubmit={handleSubmit(handleCreateRetailer)}
          className="grid w-full grid-cols-4 gap-2"
        >
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
                          label="Quick books Customer ID"
                          name="qbo_customer_ref_id"
                          placeholder="Enter Quick books Customer ID"
                          error={errors.qbo_customer_ref_id?.message}
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
                      name="default_warehouse"
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={
                            dataRetailerWarehouse.results?.map((item) => ({
                              label: item?.name,
                              value: item?.id
                            })) || []
                          }
                          handleChangeText={handleSearchWarehouse}
                          label="Default warehouse"
                          name="default_warehouse"
                          placeholder="Select default warehouse"
                          onReload={handleGetRetailerWarehouse}
                          pathRedirect="/warehouse/create"
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
                          options={
                            dataRetailerCarrier.results?.map((item) => ({
                              label: item?.account_number,
                              value: item?.id,
                              description: `-
                              Service: ${item?.service?.name} -
                              Shipper: ${item?.shipper?.name}`
                            })) || []
                          }
                          handleChangeText={handleSearchRetailerCarrier}
                          label="Default carrier"
                          name="default_carrier"
                          placeholder="Select default carrier"
                          onReload={handleGetRetailerCarrier}
                          pathRedirect="/retailer-carrier/create"
                          error={errors.default_carrier?.message}
                        />
                      )}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
          <div className="col-span-2 flex flex-col gap-2">
            <div className="grid w-full grid-cols-1">
              <Card className="flex w-full flex-col gap-4">
                <div>
                  <Controller
                    control={control}
                    name="sftp_host"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter SFTP host"
                        label="SFTP host"
                        name="sftp_host"
                        error={errors.sftp_host?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="sftp_username"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter SFTP username"
                        label="SFTP username"
                        name="sftp_username"
                        error={errors.sftp_username?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="sftp_password"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter SFTP password"
                        label="SFTP password"
                        type="password"
                        name="sftp_password"
                        error={errors.sftp_password?.message}
                      />
                    )}
                  />
                </div>
              </Card>
              {errorMessage && <span className="text-sm font-medium text-red">{errorMessage}</span>}
              <div className="my-[16px] flex justify-end">
                <Button
                  type="submit"
                  isLoading={isLoadingCreate}
                  disabled={isLoadingCreate}
                  className="bg-primary500"
                >
                  {params?.id ? 'Update' : 'Create'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {showSuccessAlert && (
        <Alert
          autoHideDuration={2000}
          color="success"
          title="Success"
          description={params?.id ? 'Update Retailer Success' : 'Create Retailer Success'}
          onClose={handleSuccessAlertClose}
          closeButton
          floating
        />
      )}
    </main>
  );
};

export default NewRetailerContainer;
