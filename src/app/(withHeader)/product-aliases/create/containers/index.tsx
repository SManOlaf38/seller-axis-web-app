'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { useStore } from '@/app/(withHeader)/product-aliases/context';
import * as actions from '@/app/(withHeader)/product-aliases/context/action';
import * as services from '@/app/(withHeader)/product-aliases/fetch/index';
import { useStore as useStoreProduct } from '@/app/(withHeader)/products/context';
import * as actionsProduct from '@/app/(withHeader)/products/context/action';
import * as servicesProduct from '@/app/(withHeader)/products/fetch/index';
import { useStore as useStoreRetailerWarehouse } from '@/app/(withHeader)/retailer-warehouse/context';
import * as actionsRetailerWarehouse from '@/app/(withHeader)/retailer-warehouse/context/action';
import * as servicesRetailerWarehouse from '@/app/(withHeader)/retailer-warehouse/fetch/index';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import { yupResolver } from '@hookform/resolvers/yup';
import { schemaProductAlias, schemaProductWarehouse } from '../../constants';
import type {
  CreateProductWarehouseStaticDataService,
  ProductAlias,
  ProductAliasValueType,
  RetailerWarehouseProduct
} from '../../interface';
import FormProductAlias from '../components/FormProductAlias';
import FormWarehouse from '../components/FormWarehouse';
import { openAlertMessage } from '@/components/ui/Alert/context/action';

export type Items = {
  next_available_date: string;
  next_available_qty: string;
  product_alias: string;
  product_warehouse_statices_id: string;
  qty_on_hand: string;
  retailer_warehouse: { label: string; value: string };
  retailer_warehouse_products_id: string;
  status: string;
};

const NewProductAliasContainer = ({ detail }: { detail?: ProductAlias }) => {
  const router = useRouter();
  const { page } = usePagination();

  const {
    state: { isLoadingProductWarehouse, isLoading, dataRetailer, dataProductAliasDetail, error },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const {
    state: { dataProduct },
    dispatch: dispatchSupplier
  } = useStoreProduct();

  const {
    state: { dataRetailerWarehouse },
    dispatch: dispatchRetailerWarehouse
  } = useStoreRetailerWarehouse();

  const { debouncedSearchTerm, handleSearch } = useSearch();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<Items>({
    next_available_date: '',
    next_available_qty: '',
    product_alias: '',
    product_warehouse_statices_id: '',
    qty_on_hand: '',
    retailer_warehouse: { label: '', value: '' },
    retailer_warehouse_products_id: '',
    status: ''
  });

  const defaultValues = useMemo(() => {
    return {
      services: {
        label: 'CommerceHub',
        value: 3
      },
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
    watch,
    getValues
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schemaProductAlias)
  });

  const {
    control: controlWarehouse,
    formState: { errors: errorsWarehouse },
    handleSubmit: handleSubmitWarehouse,
    reset: resetWarehouse,
    watch: watchWarehouse,
    setValue: setValueWarehouse
  } = useForm({
    defaultValues: {
      retailer_warehouse: null,
      status: '',
      qty_on_hand: 0,
      next_available_qty: '',
      next_available_date: '',
      items: []
    },
    mode: 'onChange',
    resolver: yupResolver<any>(schemaProductWarehouse)
  });

  const currentServices = watch('services');

  const items = watchWarehouse('items');
  const retailer_warehouse = watchWarehouse('retailer_warehouse');
  const status = watchWarehouse('status');
  const qty_on_hand = watchWarehouse('qty_on_hand');
  const next_available_qty = watchWarehouse('next_available_qty');
  const next_available_date = watchWarehouse('next_available_date');

  const handleDeleteRetailerArray = async (data: Items) => {
    setErrorMessage('');
    try {
      dispatch(actions.createProductWarehouseRequest());
      await services.deleteRetailerWarehouseProductService({
        id: +data.retailer_warehouse_products_id
      });

      const newData = [...items];

      const newDataUpdate = newData.filter(
        (item) => item.retailer_warehouse_products_id !== data.retailer_warehouse_products_id
      );

      setValueWarehouse('items', newDataUpdate);
      dispatch(actions.createProductWarehouseSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.createProductWarehouseFailure());
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleAddRetailerArray = async () => {
    if (items.find((item: Items) => item.retailer_warehouse.value === retailer_warehouse.value)) {
      return setErrorMessage('Retailer warehouse must make a unique');
    } else {
      setErrorMessage('');
      try {
        dispatch(actions.createProductWarehouseRequest());
        const dataRetailerWarehouseProduct = await services.createRetailerWarehouseProductService({
          product_alias: +dataProductAliasDetail.id,
          retailer_warehouse: retailer_warehouse.value
        });

        if (dataRetailerWarehouseProduct.id) {
          const dataBody = {
            product_warehouse_id: dataRetailerWarehouseProduct.id,
            status: status,
            qty_on_hand: qty_on_hand,
            next_available_qty: next_available_qty,
            next_available_date: next_available_date
              ? dayjs(next_available_date).format('YYYY-MM-DDTHH:mm:ss.000ZZ')
              : ''
          };
          const formatDataBody: CreateProductWarehouseStaticDataService = Object.fromEntries(
            Object.entries(dataBody).filter(([_, v]) => v !== '')
          ) as CreateProductWarehouseStaticDataService;

          try {
            const dataProductStatic = await services.createProductWarehouseStaticDataService(
              formatDataBody
            );

            const newData = [
              ...items,
              {
                retailer_warehouse_products_id: dataRetailerWarehouseProduct.id,
                product_warehouse_statices_id: dataProductStatic.id,
                product_alias: dataProductAliasDetail.id,
                retailer_warehouse,
                status,
                qty_on_hand,
                next_available_qty,
                next_available_date
              }
            ];
            setValueWarehouse('items', newData);

            resetWarehouse({
              ...getValues(),
              retailer_warehouse: null,
              status: '',
              qty_on_hand: 0,
              next_available_qty: 0,
              next_available_date: ''
            });
            dispatch(actions.createProductWarehouseSuccess());
            dispatchAlert(
              openAlertMessage({
                message: 'Successfully',
                color: 'success',
                title: 'Success'
              })
            );
          } catch (error: any) {
            dispatch(actions.createProductWarehouseFailure());
            dispatchAlert(
              openAlertMessage({
                message: error.message,
                color: 'error',
                title: 'Fail'
              })
            );
          }
        }
      } catch (error: any) {
        dispatch(actions.createProductWarehouseFailure());
      }
    }
  };

  const handleUpdateRetailerArray = async () => {
    setErrorMessage('');
    try {
      dispatch(actions.createProductWarehouseRequest());
      const dataRetailerWarehouseProduct = await services.updateRetailerWarehouseProductService({
        id: +dataUpdate.retailer_warehouse_products_id,
        product_alias: +dataProductAliasDetail.id,
        retailer_warehouse: retailer_warehouse.value
      });

      if (dataRetailerWarehouseProduct.id) {
        try {
          await services.updateProductWarehouseStaticDataService({
            id: +dataUpdate.product_warehouse_statices_id,
            product_warehouse_id: dataRetailerWarehouseProduct.id,
            status: status,
            qty_on_hand: qty_on_hand,
            next_available_qty: next_available_qty,
            next_available_date: dayjs(next_available_date).format('YYYY-MM-DDTHH:mm:ss.000ZZ')
          });

          const newData = [...items];

          const newDataUpdate = newData.map((item) =>
            item.retailer_warehouse_products_id === dataUpdate.retailer_warehouse_products_id
              ? {
                  ...item,
                  product_alias: dataProductAliasDetail.id,
                  retailer_warehouse,
                  status,
                  qty_on_hand,
                  next_available_qty,
                  next_available_date
                }
              : item
          );

          setValueWarehouse('items', newDataUpdate);

          resetWarehouse({
            ...getValues(),
            retailer_warehouse: null,
            status: '',
            qty_on_hand: 0,
            next_available_qty: 0,
            next_available_date: ''
          });
          dispatch(actions.createProductWarehouseSuccess());
          dispatchAlert(
            openAlertMessage({
              message: 'Successfully',
              color: 'success',
              title: 'Success'
            })
          );
        } catch (error: any) {
          dispatch(actions.createProductWarehouseFailure());
          dispatchAlert(
            openAlertMessage({
              message: error.message,
              color: 'error',
              title: 'Fail'
            })
          );
        }
      }
    } catch (error: any) {
      dispatch(actions.createProductWarehouseFailure());
    }
  };

  const handleCreateProductAlias = async (data: ProductAliasValueType) => {
    try {
      dispatch(actions.createProductAliasRequest());
      const dataProductAlias = await services.createProductAliasService({
        ...data,
        product: data.product.value,
        services: data.services.value,
        retailer: data.retailer.value
      });
      dispatch(actions.createProductAliasSuccess());
      router.push(`/product-aliases/${dataProductAlias.id}`);
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.createProductAliasFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
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
      dispatchAlert(
        openAlertMessage({
          message: 'Successfully',
          color: 'success',
          title: 'Success'
        })
      );
    } catch (error: any) {
      dispatch(actions.updateProductAliasFailure(error.message));
      dispatchAlert(
        openAlertMessage({
          message: error.message,
          color: 'error',
          title: 'Fail'
        })
      );
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

  const handleGetRetailerWarehouse = useCallback(async () => {
    try {
      dispatchRetailerWarehouse(actionsRetailerWarehouse.getRetailerWarehouseRequest());
      const dataProduct = await servicesRetailerWarehouse.getRetailerWarehouseService({
        search: debouncedSearchTerm,
        page: 0
      });
      dispatchRetailerWarehouse(actionsRetailerWarehouse.getRetailerWarehouseSuccess(dataProduct));
    } catch (error) {
      dispatchRetailerWarehouse(actionsRetailerWarehouse.getRetailerWarehouseFailure(error));
    }
  }, [dispatchRetailerWarehouse, debouncedSearchTerm]);

  const handleRetailer = useCallback(async () => {
    try {
      dispatch(actions.getRetailerRequest());
      const dataRetailers = await services.getRetailerService({
        search: debouncedSearchTerm,
        page
      });
      dispatch(actions.getRetailerSuccess(dataRetailers.results));
    } catch (error) {
      dispatch(actions.getRetailerFailure(error));
    }
  }, [dispatch, debouncedSearchTerm, page]);

  const handleUpdateProductWarehouse = (data: Items) => {
    setDataUpdate(data);
    setIsUpdate(true);
    setValueWarehouse('retailer_warehouse', data.retailer_warehouse);
    setValueWarehouse('status', data.status);
    setValueWarehouse('qty_on_hand', data.qty_on_hand);
    setValueWarehouse('next_available_qty', data.next_available_qty);
    setValueWarehouse('next_available_date', data.next_available_date);
  };

  const handleCancelUpdate = () => {
    setIsUpdate(false);
    resetWarehouse({
      retailer_warehouse: null,
      status: '',
      qty_on_hand: 0,
      next_available_qty: 0,
      next_available_date: ''
    });
  };

  useEffect(() => {
    handleGetProduct();
    handleRetailer();
    handleGetRetailerWarehouse();
  }, [handleGetProduct, handleGetRetailerWarehouse, handleRetailer]);

  useEffect(() => {
    if (detail && detail.id) {
      dispatch(actions.getProductAliasDetailSuccess(detail));
      const itemData = dataProductAliasDetail?.retailer_warehouse_products?.map(
        (item: RetailerWarehouseProduct) => ({
          retailer_warehouse_products_id: item?.id,
          product_warehouse_statices_id: item?.product_warehouse_statices?.id,
          product_alias: dataProductAliasDetail?.id,
          retailer_warehouse: {
            label: item.retailer_warehouse.name,
            value: item.retailer_warehouse.id
          },
          status: item?.product_warehouse_statices?.status,
          qty_on_hand: item?.product_warehouse_statices?.qty_on_hand,
          next_available_qty: item?.product_warehouse_statices?.next_available_qty,
          next_available_date: item?.product_warehouse_statices?.next_available_date
        })
      );
      reset({
        ...dataProductAliasDetail,
        retailer: {
          label: dataProductAliasDetail.retailer?.name,
          value: dataProductAliasDetail.retailer?.id
        },
        product: {
          label: dataProductAliasDetail.product?.sku,
          value: dataProductAliasDetail.product?.id
        },
        items: itemData
      });

      resetWarehouse({
        retailer_warehouse: null,
        status: '',
        qty_on_hand: 0,
        next_available_qty: 0,
        next_available_date: '',
        items: itemData
      });
    }
  }, [detail, dispatch, dataProductAliasDetail, reset, resetWarehouse]);

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
          retailerArray={items}
          error={error}
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
          handleUpdateProductWarehouse={handleUpdateProductWarehouse}
          handleDeleteRetailerArray={handleDeleteRetailerArray}
        />
      </form>

      <form
        noValidate
        onSubmit={handleSubmitWarehouse(
          isUpdate ? handleUpdateRetailerArray : handleAddRetailerArray
        )}
        className="grid w-full grid-cols-1 gap-4"
      >
        <FormWarehouse
          isLoadingProductWarehouse={isLoadingProductWarehouse}
          errorMessage={errorMessage}
          retailerArray={items}
          error={error}
          isEdit={!!dataProductAliasDetail.id}
          onGetRetailerWarehouse={handleGetRetailerWarehouse}
          errors={errorsWarehouse}
          control={controlWarehouse}
          dataRetailerWarehouse={dataRetailerWarehouse.results}
          handleSearch={handleSearch}
          handleUpdateProductWarehouse={handleUpdateProductWarehouse}
          handleCancelUpdate={handleCancelUpdate}
          isUpdate={isUpdate}
          handleDeleteRetailerArray={handleDeleteRetailerArray}
        />
      </form>
    </main>
  );
};

export default NewProductAliasContainer;
