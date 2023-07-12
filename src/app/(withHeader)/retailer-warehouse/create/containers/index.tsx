'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useStore } from '@/app/(withHeader)/retailer-warehouse/context';
import * as actions from '@/app/(withHeader)/retailer-warehouse/context/action';
import * as services from '@/app/(withHeader)/retailer-warehouse/fetch/index';
import { useStore as useStoreRetailer } from '@/app/(withHeader)/retailers/context';
import * as actionsRetailer from '@/app/(withHeader)/retailers/context/action';
import * as servicesRetailer from '@/app/(withHeader)/retailers/fetch/index';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaRetailerWarehouse } from '../../constants';
import FormRetailerWarehouse from '../components/FormProductAlias';
import type { RetailerWarehouse, RetailerWarehouseValueType } from '../../interface';

const NewRetailerWarehouseContainer = ({ detail }: { detail?: RetailerWarehouse }) => {
  const router = useRouter();
  const { page, rowsPerPage } = usePagination();

  const {
    state: { isLoading, dataRetailerWarehouseDetail },
    dispatch
  } = useStore();

  const {
    state: { dataRetailer },
    dispatch: dispatchRetailer
  } = useStoreRetailer();

  const { debouncedSearchTerm, handleSearch } = useSearch();

  const defaultValues = useMemo(() => {
    return {
      retailer: null,
      name: '',
      description: '',
      address: ''
    };
  }, []);

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaRetailerWarehouse)
  });

  const handleCreateRetailerWarehouse = async (data: RetailerWarehouseValueType) => {

    try {
      dispatch(actions.createRetailerWarehouseRequest());
      await services.createRetailerWarehouseService({
        ...data,
        retailer: data.retailer.value
      });
      dispatch(actions.createRetailerWarehouseSuccess());
      router.push('/retailer-warehouse');
    } catch (error: any) {
      dispatch(actions.createRetailerWarehouseFailure(error.message));
    }
  };

  const handleUpdateRetailerWarehouse = async (data: RetailerWarehouseValueType) => {
    try {
      dispatch(actions.updateRetailerWarehouseRequest());
      await services.updateRetailerWarehouseService({
        ...data,
        id: dataRetailerWarehouseDetail.id,
        retailer: data.retailer.value
      });
      dispatch(actions.updateRetailerWarehouseSuccess());
      router.push('/retailer-warehouse');
    } catch (error: any) {
      dispatch(actions.updateRetailerWarehouseFailure(error.message));
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

  useEffect(() => {
    handleRetailer();
  }, [handleRetailer]);

  useEffect(() => {
    if (detail && detail.id) {
      dispatch(actions.getRetailerWarehouseDetailSuccess(detail));
      reset(dataRetailerWarehouseDetail);
    }
  }, [detail, dispatch, dataRetailerWarehouseDetail, reset]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">
        {detail?.id ? 'Update Retailer Warehouse' : 'Create Retailer Warehouse'}
      </h2>
      <form
        noValidate
        onSubmit={handleSubmit(
          dataRetailerWarehouseDetail.id
            ? handleUpdateRetailerWarehouse
            : handleCreateRetailerWarehouse
        )}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormRetailerWarehouse
          isEdit={!!dataRetailerWarehouseDetail.id}
          onGetRetailer={handleRetailer}
          errors={errors}
          isLoading={isLoading}
          onSubmitData={handleSubmit}
          control={control}
          dataRetailer={dataRetailer.results}
          handleSearch={handleSearch}
        />
      </form>
    </main>
  );
};

export default NewRetailerWarehouseContainer;
