'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { useStore } from '@/app/(withHeader)/products/context';
import * as actions from '@/app/(withHeader)/products/context/action';
import * as services from '@/app/(withHeader)/products/fetch';
import useHandleImage from '@/hooks/useHandleImage';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaProduct } from '../../constants';
import type { FormCreateProduct } from '../../interface';
import FormProduct from '../components/FormProduct';

const NewProductContainer = () => {
  const {
    state: { isLoading, packageRules },
    dispatch
  } = useStore();

  const router = useRouter();

  const { file, image, onDeleteImage, handleImage, handleUploadImages } = useHandleImage();
  const { debouncedSearchTerm, handleSearch } = useSearch();

  const defaultValues = useMemo(() => {
    return {
      sku: '',
      unit_of_measure: 'oz',
      available: 'YES',
      upc: '',
      description: '',
      unit_cost: null,
      qty_on_hand: null,
      qty_reserve: null,
      image: '',
      cost: '',
      package_rule: null,
      warehouse: null
    };
  }, []);

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
        package_rule: +data.package_rule.value
      });
      router.push('/products');
      dispatch(actions.createProductSuccess());
    } catch (error: any) {
      dispatch(actions.createProductFailure(error.message));
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

  const handleRedirect = (name: string) => {
    router.push(`/packageRule?name:${name}`);
  };

  useEffect(() => {
    handleGetPackageRule();
  }, [handleGetPackageRule]);

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
          isLoading={isLoading}
          onSubmitData={handleSubmit}
          control={control}
          packageRules={packageRules}
          onRedirect={handleRedirect}
          setError={setError}
          setValue={setValue}
          handleSearch={handleSearch}
        />
      </form>
    </main>
  );
};

export default NewProductContainer;
