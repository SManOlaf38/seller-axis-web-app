'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/retailer-carriers/context';
import * as actions from '@/app/(withHeader)/retailer-carriers/context/action';
import * as services from '@/app/(withHeader)/retailer-carriers/fetch/index';
import { useStore as useStoreRetailer } from '@/app/(withHeader)/retailers/context';
import * as actionsRetailer from '@/app/(withHeader)/retailers/context/action';
import * as servicesRetailer from '@/app/(withHeader)/retailers/fetch/index';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaRetailerCarrier } from '../../constants';
import type { RetailerCarrier, RetailerCarrierValueType } from '../../interface';
import FormRetailerCarrier from '../components/FormRetailerCarrier';
import usePagination from '@/hooks/usePagination';
import { openAlertMessage } from '@/components/ui/Alert/context/action';

const NewRetailerCarrierContainer = ({ detail }: { detail?: RetailerCarrier }) => {
  const router = useRouter();
  const { page, rowsPerPage } = usePagination();

  const {
    state: { isLoading, dataRetailerCarrierDetail, error, dataServices },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const {
    state: { dataRetailer },
    dispatch: dispatchRetailer
  } = useStoreRetailer();

  const { debouncedSearchTerm, handleSearch } = useSearch();

  const defaultValues = useMemo(() => {
    return {
      client_id: '',
      client_secret: '',
      service: null,
      retailer: null
    };
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaRetailerCarrier)
  });

  const handleCreateRetailerCarrier = async (data: RetailerCarrierValueType) => {
    try {
      dispatch(actions.createRetailerCarrierRequest());
      await services.createRetailerCarrierService({
        ...data,
        service: data.service.value,
        retailer: data.retailer.value
      });
      dispatch(actions.createRetailerCarrierSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      router.push('/retailer-carriers');
    } catch (error: any) {
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
      dispatch(actions.createRetailerCarrierFailure(error.message));
    }
  };

  const handleUpdateRetailerCarrier = async (data: RetailerCarrierValueType) => {
    try {
      dispatch(actions.updateRetailerCarrierRequest());
      await services.updateRetailerCarrierService({
        ...data,
        id: dataRetailerCarrierDetail.id,
        service: data.service.value,
        retailer: data.retailer.value
      });
      dispatch(actions.updateRetailerCarrierSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.updateRetailerCarrierFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleRetailer = useCallback(async () => {
    try {
      dispatchRetailer(actionsRetailer.getRetailerRequest());
      const dataRetailers = await servicesRetailer.getRetailerService({
        search: debouncedSearchTerm,
        page,
        rowsPerPage
      });
      dispatchRetailer(actionsRetailer.getRetailerSuccess(dataRetailers));
    } catch (error: any) {
      dispatchRetailer(actionsRetailer.getRetailerFailure(error.message));
    }
  }, [dispatchRetailer, debouncedSearchTerm, page, rowsPerPage]);

  const handleGetServices = useCallback(async () => {
    try {
      dispatch(actions.getServiceRequest());
      const dataServices = await services.getServicesService({
        search: debouncedSearchTerm,
        page
      });
      dispatch(actions.getServiceSuccess(dataServices.results));
    } catch (error: any) {
      dispatch(actions.getServiceFailure(error.message));
    }
  }, [dispatch, debouncedSearchTerm, page]);

  useEffect(() => {
    handleRetailer();
    handleGetServices();
  }, [handleGetServices, handleRetailer]);

  useEffect(() => {
    if (detail && detail.id) {
      dispatch(actions.getRetailerCarrierDetailSuccess(detail));
      reset({
        ...dataRetailerCarrierDetail,
        retailer: {
          label: dataRetailerCarrierDetail.retailer?.name,
          value: dataRetailerCarrierDetail.retailer?.id
        },
        service: {
          label: dataRetailerCarrierDetail.service?.name,
          value: dataRetailerCarrierDetail.service?.id
        }
      });
    }
  }, [detail, dispatch, dataRetailerCarrierDetail, reset]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">
        {detail?.id ? 'Update Retailer Carrier' : 'Create Retailer Carrier'}
      </h2>
      <form
        noValidate
        onSubmit={handleSubmit(
          dataRetailerCarrierDetail.id ? handleUpdateRetailerCarrier : handleCreateRetailerCarrier
        )}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormRetailerCarrier
          error={error}
          isEdit={!!dataRetailerCarrierDetail.id}
          onGetRetailer={handleRetailer}
          onGetServices={handleGetServices}
          errors={errors}
          isLoading={isLoading}
          onSubmitData={handleSubmit}
          control={control}
          dataServices={dataServices}
          dataRetailer={dataRetailer.results}
          handleSearch={handleSearch}
        />
      </form>
    </main>
  );
};

export default NewRetailerCarrierContainer;