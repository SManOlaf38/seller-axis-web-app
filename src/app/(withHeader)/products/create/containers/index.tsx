'use client';

import timezone from 'dayjs/plugin/timezone';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { getInvoiceService } from '@/app/(withHeader)/orders/fetch';
import * as actionsInvoice from '@/app/(withHeader)/orders/context/action';
import { useStore as useStoreInvoice } from '@/app/(withHeader)/orders/context';
import { useStore as useStoreOrg } from '@/app/(withHeader)/organizations/context';
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

dayjs.extend(utc);
dayjs.extend(timezone);

const NewProductContainer = () => {
  const {
    state: { isLoading, packageRules, error },
    dispatch
  } = useStore();

  const {
    state: { organizations }
  } = useStoreOrg();
  const { dispatch: dispatchInvoice } = useStoreInvoice();

  const {
    state: { dataProductSeries },
    dispatch: dispatchProductSeries
  } = useStoreProductSeries();

  const { dispatch: dispatchAlert } = useStoreAlert();

  const router = useRouter();
  const { page, rowsPerPage, onPageChange } = usePagination();
  const currentOrganization = Cookies.get('current_organizations');
  const currentLocalTime = dayjs().utc();

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
    weight_unit: ''
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    setError
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaProduct)
  });

  const handleGetInvoice = useCallback(async () => {
    try {
      dispatchInvoice(actionsInvoice.createInvoiceQuickBookShipRequest());
      const res = await getInvoiceService();
      dispatchInvoice(actionsInvoice.createInvoiceQuickBookShipSuccess());
      localStorage.setItem('product', 'create_product');
      window.open(res?.auth_url, '_self');
    } catch (error: any) {
      dispatchInvoice(actionsInvoice.createInvoiceQuickBookShipFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error?.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  }, [dispatchAlert, dispatchInvoice]);

  const handleCreateProduct = async (data: FormCreateProduct) => {
    if (
      currentOrganization &&
      organizations[currentOrganization]?.qbo_refresh_token_exp_time &&
      dayjs(organizations[currentOrganization]?.qbo_refresh_token_exp_time)
        .utc()
        .isAfter(currentLocalTime)
    ) {
      try {
        dispatch(actions.createProductRequest());
        const dataImg = await handleUploadImages(file);

        await services.createProductService({
          ...data,
          image: dataImg,
          product_series: +data.product_series.value
        } as never);
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
    } else {
      handleGetInvoice();
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
        page,
        rowsPerPage: 100
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

  useEffect(() => {
    if (
      currentOrganization &&
      dayjs(organizations[currentOrganization]?.qbo_refresh_token_exp_time)
        .utc()
        .isBefore(currentLocalTime)
    ) {
      dispatchAlert(
        openAlertMessage({
          color: 'warning',
          placement: {
            horizontal: 'center',
            vertical: 'top'
          },
          customTimeHide: 6000,
          action: (
            <div className="flex max-w-[374px] items-start pr-[20px]">
              <span className="text-[16px] leading-6 text-white">
                Your QuickBooks access code has expired.
                <br /> Kindly click the{' '}
                <span
                  className="cursor-pointer whitespace-normal break-words text-[16px] text-dodgeBlue underline"
                  onClick={handleGetInvoice}
                >
                  LINK
                </span>{' '}
                to sign in to QuickBooks once again
              </span>
            </div>
          )
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrganization, dispatchAlert, handleGetInvoice, organizations]);

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
