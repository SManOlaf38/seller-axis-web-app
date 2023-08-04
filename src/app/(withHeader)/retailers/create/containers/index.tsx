'use client';

import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';

import { useStore } from '@/app/(withHeader)/retailers/context';
import * as actions from '@/app/(withHeader)/retailers/context/action';
import * as services from '@/app/(withHeader)/retailers/fetch';
import { DATA_TYPE, schemaRetailer } from '../../constants';
import { Retailer } from '../../interface';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import usePagination from '@/hooks/usePagination';
import Alert from '@/components/ui/Alert';

const NewRetailerContainer = () => {
  const router = useRouter();
  const { page } = usePagination();
  const params = useParams();
  const {
    state: { isLoadingCreate, detailRetailer, errorMessage, dataSFTP },
    dispatch
  } = useStore();
  const [showSuccessAlert, setShowSuccessAlert] = useState<boolean>(false);

  const handleSuccessAlertClose = () => setShowSuccessAlert(false);

  const defaultValues = {
    name: '',
    type: 'CommerceHub',
    merchant_id: '',

    retailer: '',
    sftp_host: '',
    sftp_username: '',
    sftp_password: '',
    purchase_orders_sftp_directory: '',
    acknowledgment_sftp_directory: '',
    confirm_sftp_directory: '',
    inventory_sftp_directory: '',
    invoice_sftp_directory: '',
    return_sftp_directory: '',
    payment_sftp_directory: ''
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

  const handleCreateRetailer = async (data: Retailer) => {
    try {
      if (params?.id) {
        dispatch(actions.updateRetailerRequest());
        await services.updateRetailerService(data, params?.id.toString());
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
          merchant_id: data.merchant_id
        });
        dispatch(actions.createRetailerSuccess());
        setShowSuccessAlert(true);

        if (sftp_host && sftp_username && sftp_password) {
          dispatch(actions.createSFTPRequest());
          await services.createSFTPService({
            sftp_host: data.sftp_host,
            sftp_username: data.sftp_username,
            sftp_password: data.sftp_password,
            purchase_orders_sftp_directory: data.purchase_orders_sftp_directory,
            acknowledgment_sftp_directory: data.acknowledgment_sftp_directory,
            confirm_sftp_directory: data.confirm_sftp_directory,
            inventory_sftp_directory: data.inventory_sftp_directory,
            invoice_sftp_directory: data.invoice_sftp_directory,
            return_sftp_directory: data.return_sftp_directory,
            payment_sftp_directory: data.payment_sftp_directory,
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
        ...detailRetailerSFTP
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

                <div>
                  <Controller
                    control={control}
                    name="purchase_orders_sftp_directory"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter Purchase orders SFTP directory"
                        label="Purchase orders SFTP directory"
                        name="purchase_orders_sftp_directory"
                        error={errors.purchase_orders_sftp_directory?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="acknowledgment_sftp_directory"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter Acknowledgment SFTP directory"
                        label="Acknowledgment SFTP directory"
                        name="acknowledgment_sftp_directory"
                        error={errors.acknowledgment_sftp_directory?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name="confirm_sftp_directory"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter Confirm SFTP directory"
                        label="Confirm SFTP directory"
                        name="confirm_sftp_directory"
                        error={errors.confirm_sftp_directory?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name="inventory_sftp_directory"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter Inventory SFTP directory"
                        label="Inventory SFTP directory"
                        name="inventory_sftp_directory"
                        error={errors.inventory_sftp_directory?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name="invoice_sftp_directory"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter invoice SFTP directory"
                        label="Invoice SFTP directory"
                        name="invoice_sftp_directory"
                        error={errors.invoice_sftp_directory?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="return_sftp_directory"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter Return SFTP directory"
                        label="Return SFTP directory"
                        name="return_sftp_directory"
                        error={errors.return_sftp_directory?.message}
                      />
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name="payment_sftp_directory"
                    render={({ field }) => (
                      <Input
                        {...field}
                        disabled={platform !== 'CommerceHub'}
                        placeholder="Enter Payment SFTP directory"
                        label="Payment SFTP directory"
                        name="payment_sftp_directory"
                        error={errors.payment_sftp_directory?.message}
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
