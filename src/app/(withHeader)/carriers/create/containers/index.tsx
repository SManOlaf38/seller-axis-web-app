'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import * as actionsOrder from '@/app/(withHeader)/orders/context/action';
import { useStore as useStoreOrder } from '@/app/(withHeader)/orders/context';
import { getShippingService } from '@/app/(withHeader)/orders/fetch';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/carriers/context';
import * as actions from '@/app/(withHeader)/carriers/context/action';
import * as services from '@/app/(withHeader)/carriers/fetch/index';
import { useStore as useStoreRetailer } from '@/app/(withHeader)/retailers/context';
import * as actionsRetailer from '@/app/(withHeader)/retailers/context/action';
import * as servicesRetailer from '@/app/(withHeader)/retailers/fetch/index';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaRetailerCarrier, schemaRetailerCarrierEdit } from '../../constants';
import type { RetailerCarrier, RetailerCarrierValueType } from '../../interface';
import FormRetailerCarrier from '../components/FormRetailerCarrier';
import usePagination from '@/hooks/usePagination';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import Loading from '../../[id]/loading';

const NewRetailerCarrierContainer = ({ id }: { id?: string }) => {
  const router = useRouter();
  const { page, rowsPerPage } = usePagination();

  const {
    state: { isLoading, dataRetailerCarrierDetail, error, dataServices, isLoadingUpdate },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();
  const {
    state: { dataShippingService },
    dispatch: dispatchOrder
  } = useStoreOrder();
  const { debouncedSearchTerm: debouncedSearchShip, handleSearch: handleSearchShip } =
    useSearch('ship');

  const {
    state: { dataRetailer },
    dispatch: dispatchRetailer
  } = useStoreRetailer();

  const { debouncedSearchTerm: debouncedSearchTermService, handleSearch: handleSearchService } =
    useSearch('service');
  const { debouncedSearchTerm: debouncedSearchTermRetailer, handleSearch: handleSearchRetailer } =
    useSearch('retailer');

  const defaultValues = useMemo(() => {
    return {
      client_id: '',
      client_secret: '',
      service: null,
      account_number: ''
    };
  }, []);

  const defaultValuesEdit = useMemo(() => {
    return {
      client_id: '',
      client_secret: '',
      service: null,
      account_number: '',
      default_service_type: null,

      shipper: {
        name: '',
        attention_name: '',
        tax_identification_number: '',
        phone: '',
        email: '',
        shipper_number: '',
        fax_number: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        country: '',
        company: '',
        retailer_carrier: null
      }
    };
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch
  } = useForm({
    defaultValues: id ? defaultValuesEdit : defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(id ? schemaRetailerCarrierEdit : schemaRetailerCarrier)
  });
  const service = watch('service');

  const handleCreateRetailerCarrier = async (data: RetailerCarrierValueType) => {
    try {
      dispatch(actions.createRetailerCarrierRequest());
      const res = await services.createRetailerCarrierService({
        ...data,
        service: data.service.value,
        default_service_type: +data?.default_service_type?.value
      });
      dispatch(actions.createRetailerCarrierSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      router.push(`/carriers/${res.id}`);
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

      if (dataRetailerCarrierDetail.shipper?.id && id) {
        await services.updateRetailerCarrierService({
          ...data,
          id: dataRetailerCarrierDetail.id,
          service: data.service.value,
          default_service_type: +data?.default_service_type?.value,
          shipper: {
            ...data.shipper,
            retailer_carrier: +id
          }
        });

        await services.updateShipperRetailerCarrierService({
          ...data.shipper,
          id: dataRetailerCarrierDetail.shipper?.id,
          retailer_carrier: +id
        });

        dispatch(actions.updateRetailerCarrierSuccess());
        dispatchAlert(
          openAlertMessage({
            message: 'Successfully',
            color: 'success',
            title: 'Success'
          })
        );
        router.push('/carriers');
      } else {
        id &&
          (await services.updateRetailerCarrierService({
            ...data,
            id: dataRetailerCarrierDetail.id,
            service: data.service.value,
            default_service_type: +data?.default_service_type?.value,
            shipper: {
              ...data.shipper,
              retailer_carrier: +id
            }
          }));

        id &&
          (await services.createShipperRetailerCarrierService({
            ...data.shipper,
            retailer_carrier: +id
          }));

        dispatch(actions.updateRetailerCarrierSuccess());
        dispatchAlert(
          openAlertMessage({
            message: 'Successfully',
            color: 'success',
            title: 'Success'
          })
        );
        router.push('/carriers');
      }
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
        search: debouncedSearchTermRetailer,
        page,
        rowsPerPage
      });
      dispatchRetailer(actionsRetailer.getRetailerSuccess(dataRetailers));
    } catch (error: any) {
      dispatchRetailer(actionsRetailer.getRetailerFailure(error.message));
    }
  }, [dispatchRetailer, debouncedSearchTermRetailer, page, rowsPerPage]);

  const handleGetServices = useCallback(async () => {
    try {
      dispatch(actions.getServiceRequest());
      const dataServices = await services.getServicesService({
        search: debouncedSearchTermService,
        page
      });
      dispatch(actions.getServiceSuccess(dataServices.results));
    } catch (error: any) {
      dispatch(actions.getServiceFailure(error.message));
    }
  }, [dispatch, debouncedSearchTermService, page]);

  const handleGetCarrierDetail = useCallback(
    async (id: number) => {
      try {
        dispatch(actions.getRetailerCarrierDetailRequest());
        const dataServices = await services.getRetailerCarrierDetailService(id);
        dispatch(actions.getRetailerCarrierDetailSuccess(dataServices));
      } catch (error: any) {
        dispatch(actions.getRetailerCarrierDetailFailure(error.message));
      }
    },
    [dispatch]
  );

  const handleGetShippingService = useCallback(async () => {
    try {
      dispatchOrder(actionsOrder.getShippingServiceRequest());
      const response = await getShippingService({
        search: debouncedSearchShip,
        page,
        rowsPerPage: 100,
        service: +service?.value
      });
      dispatchOrder(actionsOrder.getShippingServiceSuccess(response.results));
    } catch (error: any) {
      dispatchOrder(actionsOrder.getShippingServiceFailure(error.message));
    }
  }, [dispatchOrder, debouncedSearchShip, page, service?.value]);

  useEffect(() => {
    handleRetailer();
    handleGetServices();
  }, [handleGetServices, handleRetailer]);

  useEffect(() => {
    if (dataRetailerCarrierDetail.id) {
      reset({
        ...dataRetailerCarrierDetail,
        service: {
          label: dataRetailerCarrierDetail.service?.name,
          value: dataRetailerCarrierDetail.service?.id
        },
        shipper: dataRetailerCarrierDetail.shipper,
        default_service_type: {
          label: dataRetailerCarrierDetail?.default_service_type?.name,
          value: dataRetailerCarrierDetail?.default_service_type?.id
        }
      });
    }
  }, [dispatch, dataRetailerCarrierDetail, reset]);

  useEffect(() => {
    handleGetShippingService();
  }, [handleGetShippingService]);

  useEffect(() => {
    id && handleGetCarrierDetail(+id);
  }, [id, handleGetCarrierDetail]);

  return isLoading ? (
    <Loading />
  ) : (
    <main>
      <h2 className="my-4 text-lg font-semibold">{id ? 'Update Carrier' : 'Create Carrier'}</h2>
      <form
        noValidate
        onSubmit={handleSubmit(
          dataRetailerCarrierDetail.id ? handleUpdateRetailerCarrier : handleCreateRetailerCarrier
        )}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormRetailerCarrier
          detail={dataRetailerCarrierDetail}
          error={error}
          isEdit={!!dataRetailerCarrierDetail.id}
          onGetRetailer={handleRetailer}
          onGetServices={handleGetServices}
          errors={errors}
          isLoading={isLoadingUpdate}
          onSubmitData={handleSubmit}
          control={control}
          dataServices={dataServices}
          dataRetailer={dataRetailer.results}
          dataShippingService={dataShippingService}
          handleSearchShip={handleSearchShip}
          setValue={setValue}
        />
      </form>
    </main>
  );
};

export default NewRetailerCarrierContainer;
