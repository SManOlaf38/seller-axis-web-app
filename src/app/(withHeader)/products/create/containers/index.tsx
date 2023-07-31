'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useStore } from '@/app/(withHeader)/products/context';
import * as actions from '@/app/(withHeader)/products/context/action';
import { useStore as useStoreProductSeries } from '@/app/(withHeader)/product-series/context';
import * as actionsProductsSeries from '@/app/(withHeader)/product-series/context/action';
import * as servicesProductSeries from '@/app/(withHeader)/product-series/fetch/index';
import * as services from '@/app/(withHeader)/products/fetch';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import useHandleImage from '@/hooks/useHandleImage';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaProduct } from '../../constants';
import type { FormCreateProduct } from '../../interface';
import FormProduct from '../components/FormProduct';

const NewProductContainer = () => {
  const {
    state: { isLoading, packageRules, error },
    dispatch
  } = useStore();

  const {
    state: { dataProductSeries },
    dispatch: dispatchProductSeries
  } = useStoreProductSeries();

  const { dispatch: dispatchAlert } = useStoreAlert();

  const router = useRouter();
  const { page, rowsPerPage, onPageChange } = usePagination();

  const { file, image, onDeleteImage, handleImage, handleUploadImages } = useHandleImage();
  const { debouncedSearchTerm, handleSearch } = useSearch();

  const defaultValues = {
    sku: '',
    unit_of_measure: 'oz',
    available: 'YES',
    upc: '',
    description: '',
    unit_cost: 0,
    qty_on_hand: 0,
    qty_reserve: 0,
    qty_pending: 0,
    image: '',
    cost: '',
    warehouse: null,
    weight: 0,
    product_series: null,
    weight_unit: '',

  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    setError,
    getValues
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaProduct)
  });

  const handleCreateProduct = async (data: FormCreateProduct) => {
    try {
      dispatch(actions.createProductRequest());
      const dataImg = await handleUploadImages(file);

      await services.createProductService({
        ...data,
        image: dataImg,
        product_series: +data.product_series.value
      });
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      router.push('/products');
      dispatch(actions.createProductSuccess());
    } catch (error: any) {
      dispatch(actions.createProductFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleGetPackageRule = useCallback(async () => {
    try {
      dispatch(actions.getPackageRuleRequest());
      const data = await services.getPackageRuleService({
        search: debouncedSearchTerm
      });

      dispatch(actions.getPackageRuleSuccess(data?.results));
    } catch (error: any) {
      dispatch(actions.getPackageRuleFailure(error.message));
    }
  }, [debouncedSearchTerm, dispatch]);

  const handleGetProductSeries = useCallback(async () => {
    try {
      dispatchProductSeries(actionsProductsSeries.getProductSeriesRequest());
      const dataProduct = await servicesProductSeries.getProductSeriesService({
        search: debouncedSearchTerm,
        page
      });
      dispatchProductSeries(actionsProductsSeries.getProductSeriesSuccess(dataProduct));
    } catch (error) {
      dispatchProductSeries(actionsProductsSeries.getProductSeriesFailure(error));
    }
  }, [dispatchProductSeries, page, debouncedSearchTerm]);

  useEffect(() => {
    handleGetPackageRule();
    handleGetProductSeries();
  }, [handleGetPackageRule, handleGetProductSeries]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">Create Product</h2>

      <form
        noValidate
        onSubmit={handleSubmit(handleCreateProduct)}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormProduct
          image={image}
          onGetPackageRule={handleGetPackageRule}
          onDeleteImage={onDeleteImage}
          onChangeImage={handleImage}
          errors={errors}
          error={error}
          isLoading={isLoading}
          onSubmitData={handleSubmit}
          control={control}
          packageRules={packageRules}
          dataProductSeries={dataProductSeries.results}
          setError={setError}
          setValue={setValue}
          handleSearch={handleSearch}
          onGetProductSeries={handleGetProductSeries}
        />
      </form>
    </main>
  );
};

export default NewProductContainer;
