'use client';

import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import * as actions from '@/app/(withHeader)/productAlias/context/action';
import * as services from '@/app/(withHeader)/productAlias/fetch/index';
import * as actionsProduct from '@/app/(withHeader)/products/context/action';
import * as servicesProduct from '@/app/(withHeader)/products/fetch/index';
import { useStore } from '@/app/(withHeader)/productAlias/context';
import { useStore as useStoreProduct } from '@/app/(withHeader)/products/context';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import { schemaProductAlias } from '../../constants';
import FormProductAlias from '../components/FormProductAlias';
import { ProductAliasValueType } from '../../interface';

const NewProductAliasContainer = () => {
  const router = useRouter();

  const {
    state: { isLoading, dataRetailer },
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
    handleSubmit
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaProductAlias)
  });

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
      router.push('/productAlias');
    } catch (error: any) {
      dispatch(actions.createProductAliasFailure(error.message));
    }
  };

  const handleRedirectProduct = (name: string) => {
    router.push(`/products/create/${name}`);
  };

  const handleRedirectRetailer = (name: string) => {
    router.push(`/retailers/create/${name}`);
  };

  const handleGetRetailer = useCallback(async () => {}, []);

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

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">Create Product Alias</h2>
      <form
        noValidate
        onSubmit={handleSubmit(handleCreateProductAlias)}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormProductAlias
          onGetRetailer={handleGetRetailer}
          errors={errors}
          isLoading={isLoading}
          onSubmitData={handleSubmit}
          control={control}
          dataProduct={dataProduct.results}
          dataRetailer={dataRetailer}
          onRedirectProduct={handleRedirectProduct}
          onRedirectRetailer={handleRedirectRetailer}
          handleSearch={handleSearch}
        />
      </form>
    </main>
  );
};

export default NewProductAliasContainer;
