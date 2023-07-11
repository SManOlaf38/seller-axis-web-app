'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import useHandleImage from '@/hooks/useHandleImage';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaProduct } from '../../constants';
import { useStore } from '../../context';
import * as actions from '../../context/action';
import * as services from '../../fetch/index';
import { Product } from '../../interface';
import FormProductDetail from '../components/FormProductDetail';

const ProductDetailContainer = ({ detail }: { detail: Product }) => {
  const {
    state: { isLoading, packageRules, productDetail },
    dispatch
  } = useStore();

  const router = useRouter();

  const { file, image, onDeleteImage, handleImage, handleUploadImages, onChangeImage } =
    useHandleImage();
  const { debouncedSearchTerm, handleSearch } = useSearch();

  const defaultValues = useMemo(() => {
    return {
      sku: '',
      unit_of_measure: 'oz',
      available: 'YES',
      upc: '',
      description: '',
      unit_cost: 0,
      qty_on_hand: 0,
      qty_reserve: 0,
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
    reset
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaProduct)
  });

  const handleUpdateProduct = async (data: any) => {
    try {
      dispatch(actions.createProductRequest());

      if (file) {
        const dataImg = await handleUploadImages(file);

        const res = await services.updateProductService({
          ...data,
          id: detail.id,
          image: dataImg,
          package_rule: +data.package_rule.value
        });
        dispatch(actions.updateProductSuccess(res));
      } else {
        const res = await services.updateProductService({
          ...data,
          id: detail.id,
          image: productDetail.image,
          package_rule: +data.package_rule.value
        });
        dispatch(actions.updateProductSuccess(res));
      }
      router.push('/products');
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

  useEffect(() => {
    if (detail.id) {
      dispatch(actions.getProductDetailSuccess(detail));
      reset({
        ...productDetail,
        package_rule: {
          label: productDetail.package_rule.name,
          value: productDetail.package_rule.id
        }
      });
    }
  }, [detail, dispatch, productDetail, reset]);

  useEffect(() => {
    handleGetPackageRule();
  }, [handleGetPackageRule]);

  return (
    <main>
      <h2 className="my-4 text-lg font-semibold">Update Product</h2>

      <form
        noValidate
        onSubmit={handleSubmit(handleUpdateProduct)}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormProductDetail
          image={image || productDetail?.image}
          onGetPackageRule={handleGetPackageRule}
          onDeleteImage={onDeleteImage}
          onChangeImage={handleImage}
          errors={errors}
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

export default ProductDetailContainer;
