'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/sftp/context';
import * as actions from '@/app/(withHeader)/sftp/context/action';
import * as services from '@/app/(withHeader)/sftp/fetch/index';
import { useStore as useStoreProduct } from '@/app/(withHeader)/products/context';
import * as actionsProduct from '@/app/(withHeader)/products/context/action';
import * as servicesProduct from '@/app/(withHeader)/products/fetch/index';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaSFTP } from '../../constants';
import type { SFTP, SFTPValueType } from '../../interface';
import FormSFTP from '../components/FormSFTP';
import { openAlertMessage } from '@/components/ui/Alert/context/action';

const NewSFTPContainer = ({ detail }: { detail?: SFTP }) => {
  const router = useRouter();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const {
    state: { isLoading, dataRetailer, dataSFTPDetail },
    dispatch
  } = useStore();

  const {
    state: { dataProduct },
    dispatch: dispatchSupplier
  } = useStoreProduct();

  const { debouncedSearchTerm, handleSearch } = useSearch();

  const defaultValues = useMemo(() => {
    return {
      retailer: null,
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
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaSFTP)
  });

  const handleCreateSFTP = async (data: SFTPValueType) => {
    try {
      dispatch(actions.createSFTPRequest());
      await services.createSFTPService({
        ...data,
        retailer: data.retailer.value
      });
      dispatch(actions.createSFTPSuccess());
      router.push('/sftp');
    } catch (error: any) {
      dispatch(actions.createSFTPFailure(error.message));
    }
  };

  const handleUpdateSFTP = async (data: SFTPValueType) => {
    try {
      dispatch(actions.updateSFTPRequest());
      await services.updateSFTPService({
        ...data,
        id: dataSFTPDetail.id,
        retailer: data.retailer.value
      });
      dispatch(actions.updateSFTPSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Update SFTP Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.updateSFTPFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message || 'Update Fail',
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetRetailer = useCallback(async () => {}, []);

  const handleGetProduct = useCallback(async () => {
    try {
      dispatchSupplier(actionsProduct.getProductRequest());
      const dataProduct = await servicesProduct.getProductService({
        search: debouncedSearchTerm,
        page: 0,
        rowsPerPage: 100
      });
      dispatchSupplier(actionsProduct.getProductSuccess(dataProduct));
    } catch (error) {
      dispatchSupplier(actionsProduct.getProductFailure(error));
    }
  }, [dispatchSupplier, debouncedSearchTerm]);

  const handleRetailer = useCallback(async () => {
    try {
      dispatch(actions.getRetailerRequest());
      const dataRetailer = await services.getRetailerService({
        search: debouncedSearchTerm,
        page: 0
      });

      dispatch(actions.getRetailerSuccess(dataRetailer.results));
    } catch (error) {
      dispatch(actions.getRetailerFailure(error));
    }
  }, [dispatch, debouncedSearchTerm]);

  useEffect(() => {
    handleGetProduct();
    handleRetailer();
  }, [handleGetProduct, handleRetailer]);

  useEffect(() => {
    if (detail && detail.id) {
      dispatch(actions.getSFTPDetailSuccess(detail));
      reset({
        ...dataSFTPDetail,
        retailer: {
          label: detail.retailer.name,
          value: detail.retailer.id
        }
      });
    }
  }, [detail, dispatch, dataSFTPDetail, reset]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">{detail?.id ? 'Update SFTP' : 'Create SFTP'}</h2>
      <form
        noValidate
        onSubmit={handleSubmit(dataSFTPDetail.id ? handleUpdateSFTP : handleCreateSFTP)}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormSFTP
          isEdit={!!dataSFTPDetail.id}
          onGetRetailer={handleGetRetailer}
          errors={errors}
          isLoading={isLoading}
          onSubmitData={handleSubmit}
          control={control}
          dataProduct={dataProduct.results}
          dataRetailer={dataRetailer}
          handleSearch={handleSearch}
        />
      </form>
    </main>
  );
};

export default NewSFTPContainer;
