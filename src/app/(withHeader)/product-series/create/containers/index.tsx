'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useStore as useStoreProduct } from '@/app/(withHeader)/products/context';
import { useStoreBox } from '@/app/(withHeader)/box/context';
import { useStore } from '@/app/(withHeader)/product-series/context';
import { getBoxFailure, getBoxRequest, getBoxSuccess } from '@/app/(withHeader)/box/context/action';
import { getBoxService } from '@/app/(withHeader)/box/fetch';
import * as actions from '@/app/(withHeader)/product-series/context/action';
import * as actionsProduct from '@/app/(withHeader)/products/context/action';

import * as services from '@/app/(withHeader)/product-series/fetch/index';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaProductSeries } from '../../constants';
import type { ProductSeries, ProductSeriesValueType } from '../../interface';
import FormPackageRule from '../components/FormPackageRule';
import FormProductSeries from '../components/FormProductSeries';
import usePackageRule from '../hooks/usePackageRule';
import { getProductService } from '@/app/(withHeader)/products/fetch';

export type Items = {
  id: string | number;
  next_available_date: string;
  next_available_qty: string;
  product_alias: string;
  product_warehouse_statices_id: string;
  qty_on_hand: string;
  retailer_warehouse: { label: string; value: string };
  retailer_warehouse_products_id: string;
  status: string;
};

const NewProductSeriesContainer = ({ detail }: { detail?: ProductSeries }) => {
  const router = useRouter();
  const { page, rowsPerPage } = usePagination();

  const {
    state: { isLoading, dataProductSeriesDetail, error },
    dispatch
  } = useStore();

  const {
    state: { dataBox },
    dispatch: boxDispatch
  } = useStoreBox();

  const {
    state: { dataProduct },
    dispatch: dispatchProduct
  } = useStoreProduct();

  const { dispatch: dispatchAlert } = useStoreAlert();

  const { debouncedSearchTerm, handleSearch } = useSearch();

  const defaultValues = useMemo(() => {
    return {
      series: ''
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
    resolver: yupResolver<any>(schemaProductSeries)
  });

  const {
    isUpdate,
    items,
    errorsPackageRule,
    controlPackageRule,
    resetPackageRule,
    handleCancelUpdate,
    handleCreatePackageRule,
    handleDeletePackageRule,
    handleUpdatePackageRule,
    handleEditPackageRule,
    handleSubmitPackageRule
  } = usePackageRule({ dataProductSeriesDetail });

  const handleCreateProductSeries = async (data: ProductSeriesValueType) => {
    try {
      dispatch(actions.createProductSeriesRequest());
      const dataProductSeries = await services.createProductSeriesService({
        ...data
      });
      dispatch(actions.createProductSeriesSuccess());
      router.push(`/product-series/${dataProductSeries.id}`);
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.createProductSeriesFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleUpdateProductSeries = async (data: ProductSeriesValueType) => {
    try {
      dispatch(actions.updateProductSeriesRequest());
      await services.updateProductSeriesService({
        ...data,
        id: dataProductSeriesDetail.id
      });
      dispatch(actions.updateProductSeriesSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.updateProductSeriesFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetBox = useCallback(async () => {
    try {
      boxDispatch(getBoxRequest());
      const dataBox = await getBoxService({
        search: debouncedSearchTerm || '',
        page,
        rowsPerPage,
        product_id: ''
      });
      boxDispatch(getBoxSuccess(dataBox));
    } catch (error: any) {
      boxDispatch(getBoxFailure(error));
    }
  }, [boxDispatch, debouncedSearchTerm, page, rowsPerPage]);

  useEffect(() => {
    if (detail && detail.id) {
      dispatch(actions.getProductSeriesDetailSuccess(detail));
      reset({
        ...dataProductSeriesDetail
      });

      resetPackageRule({
        box: null,
        id: '',
        max_quantity: '',
        items: dataProductSeriesDetail?.package_rules?.map((item) => ({
          id: item.id,
          box: {
            label: item.box.name,
            value: item.box.id
          },
          max_quantity: item.max_quantity
        }))
      });
    }
  }, [detail, dispatch, dataProductSeriesDetail, reset, resetPackageRule]);

  useEffect(() => {
    handleGetBox();
  }, [handleGetBox]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">
        {detail?.id ? 'Update Product Series' : 'Create Product Series'}
      </h2>
      <form
        noValidate
        onSubmit={handleSubmit(
          dataProductSeriesDetail.id ? handleUpdateProductSeries : handleCreateProductSeries
        )}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormProductSeries
          error={error}
          isEdit={!!dataProductSeriesDetail.id}
          errors={errors}
          isLoading={isLoading}
          control={control}
        />
      </form>

      <form
        noValidate
        onSubmit={handleSubmitPackageRule(
          isUpdate ? handleUpdatePackageRule : handleCreatePackageRule
        )}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormPackageRule
          isLoadingProductWarehouse={false}
          errorMessage={''}
          packageRules={items}
          error={error}
          isEdit={!!dataProductSeriesDetail.id}
          errors={errorsPackageRule}
          control={controlPackageRule}
          dataBoxes={dataBox.results}
          dataProduct={dataProduct.results}
          isUpdate={isUpdate}
          onGetBoxes={handleGetBox}
          handleSearch={handleSearch}
          handleEditPackageRule={handleEditPackageRule}
          handleCancelUpdate={handleCancelUpdate}
          handleDeletePackageRule={handleDeletePackageRule}
        />
      </form>
    </main>
  );
};

export default NewProductSeriesContainer;
