'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useStore } from '@/app/(withHeader)/product-aliases/context';
import * as actions from '@/app/(withHeader)/product-aliases/context/action';
import * as services from '@/app/(withHeader)/product-aliases/fetch/index';
import { useStore as useStoreProduct } from '@/app/(withHeader)/products/context';
import * as actionsProduct from '@/app/(withHeader)/products/context/action';
import * as servicesProduct from '@/app/(withHeader)/products/fetch/index';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaProductAlias } from '../../constants';
import type { ProductAlias, ProductAliasValueType } from '../../interface';
import FormProductAlias from '../components/FormProductAlias';

const NewProductAliasContainer = ({ detail }: { detail?: ProductAlias }) => {
  const router = useRouter();

  const {
    state: { isLoading, dataRetailer, dataProductAliasDetail },
    dispatch
  } = useStore();

  const {
    state: { dataProduct },
    dispatch: dispatchSupplier
  } = useStoreProduct();

  const { debouncedSearchTerm, handleSearch } = useSearch();

  const defaultValues = useMemo(() => {
    return {
      services: null,
      retailer: null,
      product: null,
      sku: '',
      merchant_sku: '',
      vendor_sku: ''
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
    resolver: yupResolver<any>(schemaProductAlias)
  });

  const currentServices = watch('services');

  const handleCreateProductAlias = async (data: ProductAliasValueType) => {
    try {
      dispatch(actions.createProductAliasRequest());
      await services.createProductAliasService({
        ...data,
        product: data.product.value,
        services: data.services.value,
        retailer: data.retailer.value
      });
      dispatch(actions.createProductAliasSuccess());
      router.push('/product-aliases');
    } catch (error: any) {
      dispatch(actions.createProductAliasFailure(error.message));
    }
  };

  const handleUpdateProductAlias = async (data: ProductAliasValueType) => {
    try {
      dispatch(actions.updateProductAliasRequest());
      await services.updateProductAliasService({
        ...data,
        id: dataProductAliasDetail.id,
        product: data.product.value,
        services: data.services.value,
        retailer: data.retailer.value
      });
      dispatch(actions.updateProductAliasSuccess());
      router.push('/product-aliases');
    } catch (error: any) {
      dispatch(actions.updateProductAliasFailure(error.message));
    }
  };

  const handleGetProduct = useCallback(async () => {
    try {
      dispatchSupplier(actionsProduct.getProductRequest());
      const dataProduct = await servicesProduct.getProductService({
        search: debouncedSearchTerm,
        page: 0
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
      dispatch(actions.getProductAliasDetailSuccess(detail));
      reset({
        ...dataProductAliasDetail,
        retailer: {
          label: dataProductAliasDetail.retailer?.name,
          value: dataProductAliasDetail.retailer?.id
        },
        product: {
          label: dataProductAliasDetail.product?.sku,
          value: dataProductAliasDetail.product?.id
        }
      });
    }
  }, [detail, dispatch, dataProductAliasDetail, reset]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">
        {detail?.id ? 'Update Product Alias' : 'Create Product Alias'}
      </h2>
      <form
        noValidate
        onSubmit={handleSubmit(
          dataProductAliasDetail.id ? handleUpdateProductAlias : handleCreateProductAlias
        )}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormProductAlias
          currentServices={currentServices}
          isEdit={!!dataProductAliasDetail.id}
          onGetRetailer={handleRetailer}
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

export default NewProductAliasContainer;
