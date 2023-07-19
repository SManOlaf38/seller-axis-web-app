'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useStore } from '@/app/(withHeader)/products/context';
import * as actions from '@/app/(withHeader)/products/context/action';
import * as services from '@/app/(withHeader)/products/fetch';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import useHandleImage from '@/hooks/useHandleImage';
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

  const { dispatch: dispatchAlert } = useStoreAlert();

  const router = useRouter();

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
    weight: 0
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
        image: dataImg
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
          error={error}
          isLoading={isLoading}
          onSubmitData={handleSubmit}
          control={control}
          packageRules={packageRules}
          setError={setError}
          setValue={setValue}
          handleSearch={handleSearch}
        />
      </form>
    </main>
  );
};

export default NewProductContainer;
