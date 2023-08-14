'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/warehouse/context';
import * as actions from '@/app/(withHeader)/warehouse/context/action';
import * as services from '@/app/(withHeader)/warehouse/fetch/index';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaRetailerWarehouse } from '../../constants';
import FormRetailerWarehouse from '../components/FormProductAlias';
import type { RetailerWarehouse, RetailerWarehouseValueType } from '../../interface';
import { openAlertMessage } from '@/components/ui/Alert/context/action';

const NewRetailerWarehouseContainer = ({ detail }: { detail?: RetailerWarehouse }) => {
  const router = useRouter();

  const {
    state: { isLoading, dataRetailerWarehouseDetail, error },
    dispatch
  } = useStore();

  const { dispatch: dispatchAlert } = useStoreAlert();

  const defaultValues = useMemo(() => {
    return {
      name: '',
      description: '',
      address_1: '',
      address_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      phone: ''
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
    resolver: yupResolver<any>(schemaRetailerWarehouse)
  });

  const handleCreateRetailerWarehouse = async (data: RetailerWarehouseValueType) => {
    try {
      dispatch(actions.createRetailerWarehouseRequest());
      await services.createRetailerWarehouseService(data);
      dispatch(actions.createRetailerWarehouseSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      router.push('/warehouse');
    } catch (error: any) {
      dispatch(actions.createRetailerWarehouseFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleUpdateRetailerWarehouse = async (data: RetailerWarehouseValueType) => {
    try {
      dispatch(actions.updateRetailerWarehouseRequest());
      await services.updateRetailerWarehouseService({
        ...data,
        id: dataRetailerWarehouseDetail.id
      });
      dispatch(actions.updateRetailerWarehouseSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.updateRetailerWarehouseFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  useEffect(() => {
    if (detail && detail.id) {
      dispatch(actions.getRetailerWarehouseDetailSuccess(detail));
      reset(dataRetailerWarehouseDetail);
    }
  }, [detail, dispatch, dataRetailerWarehouseDetail, reset]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">
        {detail?.id ? 'Update Warehouse' : 'Create Warehouse'}
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
          errors={errors}
          error={error}
          isLoading={isLoading}
          onSubmitData={handleSubmit}
          control={control}
        />
      </form>
    </main>
  );
};

export default NewRetailerWarehouseContainer;
