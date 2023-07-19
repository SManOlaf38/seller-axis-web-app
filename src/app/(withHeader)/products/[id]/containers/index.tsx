'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useStore as useStorePackageRule } from '@/app/(withHeader)/package-rules/context';
import * as PackageRuleActions from '@/app/(withHeader)/package-rules/context/action';
import * as packageRuleServices from '@/app/(withHeader)/package-rules/fetch';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import useHandleImage from '@/hooks/useHandleImage';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaPackageRule, schemaProduct } from '../../constants';
import { useStore } from '../../context';
import * as actions from '../../context/action';
import * as services from '../../fetch/index';
import { DataPackageRule, Product } from '../../interface';
import FormPackageRule from '../components/FormPackageRule';
import FormProductDetail from '../components/FormProductDetail';

const ProductDetailContainer = ({ detail }: { detail: Product }) => {
  const {
    state: { isLoading, packageRules, productDetail, error, dataBoxes },
    dispatch
  } = useStore();

  const { dispatch: dispatchPackageRule } = useStorePackageRule();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const { page, rowsPerPage } = usePagination();
  const router = useRouter();
  const { file, image, onDeleteImage, handleImage, handleUploadImages, onChangeImage } =
    useHandleImage();
  const { debouncedSearchTerm, handleSearch } = useSearch();

  const [isUpdate, setIsUpdate] = useState(false);

  const [dataUpdate, setDataUpdate] = useState<DataPackageRule>({
    box: {
      label: '',
      value: ''
    },
    id: '',
    max_quantity: ''
  });

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
      qty_pending: 0,
      image: '',
      cost: '',
      warehouse: null,
      weight: 0
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

  const defaultValuesPackageRule = useMemo(() => {
    return {
      box: null,
      max_quantity: 0,
      items: []
    };
  }, []);

  const {
    control: controlPackageRule,
    formState: { errors: errorsPackageRule },
    handleSubmit: handleSubmitPackageRule,
    setValue: setValuePackageRule,
    getValues: getValuesPackageRule,
    watch: watchPackageRule,
    reset: resetPackageRule
  } = useForm({
    defaultValues: defaultValuesPackageRule,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaPackageRule)
  });

  const items = watchPackageRule('items');
  const box = watchPackageRule('box');
  const max_quantity = watchPackageRule('max_quantity');

  const handleUpdateProduct = async (data: any) => {
    try {
      dispatch(actions.createProductRequest());

      if (file) {
        const dataImg = await handleUploadImages(file);

        const res = await services.updateProductService({
          ...data,
          id: detail.id,
          image: dataImg
        });
        dispatch(actions.updateProductSuccess(res));
      } else {
        const res = await services.updateProductService({
          ...data,
          id: detail.id,
          image: productDetail.image
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

  const handleCreatePackageRule = async () => {
    const formatDataBody = {
      product: +productDetail.id,
      max_quantity,
      box: box.value
    };
    try {
      dispatch(actions.createPackageRuleRequest());
      const dataProductStatic = await services.createPackageRuleService(formatDataBody);
      const newData = [
        ...items,
        {
          id: dataProductStatic.id,
          box,
          max_quantity
        }
      ];
      setValuePackageRule('items', newData);

      resetPackageRule({
        ...getValuesPackageRule(),
        box: null,
        max_quantity: 0
      });
      dispatch(actions.createPackageRuleSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.createPackageRuleFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleDeletePackageRule = async (row: DataPackageRule) => {
    try {
      dispatchPackageRule(PackageRuleActions.deletePackageRuleRequest());
      await packageRuleServices.deletePackageRuleService(+row.id);

      const newData = [...items];

      const newDataUpdate = newData.filter((item) => item.id !== row.id);

      setValuePackageRule('items', newDataUpdate);
      dispatchPackageRule(PackageRuleActions.deletePackageRuleSuccess(+row.id));
    } catch (error: any) {
      dispatchPackageRule(PackageRuleActions.deletePackageRuleFailure(error.message));
    }
  };

  const handleUpdateRetailerArray = async () => {
    try {
      dispatchPackageRule(PackageRuleActions.updatePackageRuleRequest());
      await packageRuleServices.updatePackageRuleService(
        {
          max_quantity,
          box: box.value
        },
        dataUpdate.id.toString()
      );

      const newData = [...items];

      const newDataUpdate = newData.map((item) =>
        item.id === dataUpdate.id
          ? {
              ...item,
              box,
              max_quantity
            }
          : item
      );

      setValuePackageRule('items', newDataUpdate);
      resetPackageRule({
        ...getValuesPackageRule(),
        box: null,
        max_quantity: 0
      });
      setIsUpdate(false);
      setDataUpdate({
        box: {
          label: '',
          value: ''
        },
        id: '',
        max_quantity: ''
      });
      dispatchPackageRule(PackageRuleActions.updatePackageRuleSuccess());
    } catch (error: any) {
      dispatchPackageRule(PackageRuleActions.updatePackageRuleFailure(error.message));
    }
  };

  const handleGetBoxes = useCallback(async () => {
    try {
      dispatch(actions.getBoxesRequest());
      const res = await services.getBoxesService({
        search: '',
        page,
        rowsPerPage
      });

      dispatch(actions.getBoxesSuccess(res.results));
    } catch (error: any) {
      dispatch(actions.getBoxesFailure(error.message));
    }
  }, [dispatch, page, rowsPerPage]);

  const handleUpdatePackageRule = (data: DataPackageRule) => {
    setDataUpdate(data);
    setIsUpdate(true);
    setValuePackageRule('max_quantity', data.max_quantity);
    setValuePackageRule('box', data.box);
  };

  const handleCancelUpdate = () => {
    setIsUpdate(false);
    resetPackageRule({
      box: null,
      max_quantity: 0
    });
  };

  useEffect(() => {
    if (detail.id) {
      dispatch(actions.getProductDetailSuccess(detail));
      reset({
        ...productDetail
      });
    }
  }, [detail, dispatch, productDetail, reset]);

  useEffect(() => {
    handleGetBoxes();
  }, [handleGetBoxes]);

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
      <form
        noValidate
        onSubmit={handleSubmitPackageRule(
          isUpdate ? handleUpdateRetailerArray : handleCreatePackageRule
        )}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormPackageRule
          isLoadingProductWarehouse={false}
          errorMessage={''}
          packageRules={items}
          error={error}
          isEdit={true}
          onGetBoxes={handleGetBoxes}
          errors={errorsPackageRule}
          control={controlPackageRule}
          dataBoxes={dataBoxes}
          handleSearch={handleSearch}
          handleUpdatePackageRule={handleUpdatePackageRule}
          handleCancelUpdate={handleCancelUpdate}
          isUpdate={isUpdate}
          handleDeleteRetailerArray={handleDeletePackageRule}
        />
      </form>
    </main>
  );
};

export default ProductDetailContainer;
