import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import IconPlus from 'public/plus-icon.svg';
import DeleteIcon from 'public/delete.svg';
import PenIcon from '/public/pencil.svg';

import { OrderItemPackages, OrderPackages } from '@/app/(withHeader)/orders/interface';
import { useStore } from '@/app/(withHeader)/orders/context';
import * as actions from '@/app/(withHeader)/orders/context/action';
import * as services from '@/app/(withHeader)/orders/fetch';
import { useStore as useStoreAlert } from '@/components/ui/Alert/context/hooks';
import { openAlertMessage } from '@/components/ui/Alert/context/action';
import { Modal } from '@/components/ui/Modal';
import Autocomplete from '@/components/ui/Autocomplete';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import usePagination from '@/hooks/usePagination';
import useSearch from '@/hooks/useSearch';
import { Button } from '@/components/ui/Button';
import { isEmptyObject } from '@/utils/utils';

import { ProductPackageSelect, headerTableEditPack } from '../../constants';

const schema = yup.object().shape({
  qty: yup
    .number()
    .typeError('Quantity is required')
    .min(0, 'Quantity must be greater than or equal to 0'),
  product: yup
    .object()
    .shape({
      label: yup.string().nonNullable(),
      value: yup.number().nonNullable()
    })
    .required('Product rule is required')
});

type RowPack = {
  openModalEditPack: boolean;
  dataPackRow: OrderPackages;
  handleCloseModalEditPack: () => void;
};

export default function ModalEditRowPack({
  openModalEditPack,
  dataPackRow,
  handleCloseModalEditPack
}: RowPack) {
  const params = useParams();
  const {
    state: { isLoadingItemPackages },
    dispatch
  } = useStore();
  const { dispatch: dispatchAlert } = useStoreAlert();

  const { debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();

  const dataDefaultProductPackRow = useMemo(() => {
    return dataPackRow?.order_item_packages;
  }, [dataPackRow]);

  const [dataTable, setDataTable] = useState<OrderItemPackages[]>([]);
  const [itemActive, setItemActive] = useState<number | undefined | null>();
  const [itemChange, setItemChange] = useState<OrderItemPackages | null>();
  const [dataProducts, setDataProducts] = useState<OrderItemPackages[]>([]);
  const [itemNotEnough, setItemNotEnough] = useState<number | undefined | null>();

  const [productDeleted, setProductDeleted] = useState<OrderItemPackages | null>();
  const [itemPackageDeleted, setItemPackageDeleted] = useState<OrderItemPackages[]>([]);

  const totalDefaultBox = useMemo(() => {
    return dataPackRow?.order_item_packages?.reduce((acc: number, product: OrderItemPackages) => {
      const skuQuantity = product?.retailer_purchase_order_item?.product_alias?.sku_quantity || 0;
      return acc + (product?.quantity || 0) * skuQuantity;
    }, 0);
  }, [dataPackRow?.order_item_packages]);

  const filteredArraySame = useMemo(() => {
    return itemPackageDeleted?.filter((item, index, array) => {
      const firstIndex = array?.findIndex((obj) => obj?.id === item?.id);
      return index === firstIndex;
    });
  }, [itemPackageDeleted]);

  const skuQuantity = useMemo(() => {
    if (itemChange) {
      return itemChange?.retailer_purchase_order_item?.product_alias?.sku_quantity || 0;
    } else if (productDeleted) {
      return productDeleted?.retailer_purchase_order_item?.product_alias?.sku_quantity || 0;
    }
    return 0;
  }, [itemChange, productDeleted]);

  const defaultValues = useMemo(() => {
    return {
      qty: 0,
      product: null
    };
  }, []);

  const {
    control,
    formState: { errors },
    clearErrors,
    watch,
    setValue
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver<any>(schema)
  });
  const product = watch('product');
  const qty = watch('qty');

  const isQtyEqualToQuantity = useMemo(() => {
    const currentQty = +qty * skuQuantity;
    if (itemChange) {
      const itemChangeQty = itemChange?.quantity || 0;
      const expectedQty = itemChangeQty * skuQuantity;

      if (totalDefaultBox === dataPackRow?.box_max_quantity) {
        if (currentQty <= dataPackRow?.box_max_quantity) {
          return false;
        }
        return expectedQty < currentQty;
      }
      if (expectedQty >= currentQty) {
        if (totalDefaultBox + currentQty <= dataPackRow?.box_max_quantity) {
          return false;
        }
      }
      return true;
    } else if (productDeleted) {
      const itemChangeQty = productDeleted?.quantity || 0;
      const expectedQty = itemChangeQty * skuQuantity;

      return expectedQty < currentQty;
    }
  }, [qty, skuQuantity, itemChange, productDeleted, totalDefaultBox, dataPackRow]);

  const totalQtyExcludingCurrent = useMemo(() => {
    return dataTable?.reduce(
      (acc: number, item: OrderItemPackages) =>
        item?.id !== product?.value ? acc + item?.quantity : acc,
      0
    );
  }, [dataTable, product?.value]);

  const newTotalQty = useMemo(() => {
    const itemChangeQty = qty || 0;

    return totalQtyExcludingCurrent + itemChangeQty * skuQuantity;
  }, [qty, skuQuantity, totalQtyExcludingCurrent]);

  const isMaxQtyReached = useMemo(() => {
    return newTotalQty > dataPackRow?.box_max_quantity;
  }, [dataPackRow?.box_max_quantity, newTotalQty]);

  const handleEditPack = (item: OrderItemPackages, index: number) => {
    setValue('qty', item?.quantity);
    setValue('product', {
      value: item?.id,
      label: item?.retailer_purchase_order_item?.product_alias?.sku
    });
    setItemChange(item);

    setItemActive(index);
  };

  const handleCancelEdit = () => {
    setValue('qty', 0);
    setValue('product', '');
    setItemActive(null);
    setItemNotEnough(null);
    clearErrors();
  };

  const handleDeletePack = async (indexItem: number) => {
    try {
      dispatch(actions.deleteOrderItemPackagesRequest());
      await services.deleteOrderItemPackagesService(indexItem);
      dispatch(actions.deleteOrderItemPackagesSuccess());
      setItemChange(null);
      dispatchAlert(
        openAlertMessage({
          message: 'Delete Order Item Package Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      setItemNotEnough(indexItem);
      const newArray = dataTable?.filter((item: OrderItemPackages) => item?.id !== indexItem);
      setDataTable(newArray);
      const dataOrder = await services.getOrderDetailServer(+params?.id);
      dispatch(actions.setOrderDetail(dataOrder));
    } catch (error: any) {
      dispatch(actions.deleteOrderPackageFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleAddProduct = async (qty: number, product: ProductPackageSelect) => {
    const objWithId = dataProducts?.find((item) => item.id === product?.value) as any;
    const newObj = {
      ...objWithId,
      id: product?.value,
      retailer_purchase_order_item: {
        ...objWithId?.retailer_purchase_order_item,
        product_alias: {
          sku: product?.label,
          ...objWithId?.retailer_purchase_order_item?.product_alias
        }
      },
      quantity: +qty
    };
    try {
      dispatch(actions.createOrderItemPackagesRequest());
      await services.createOrderItemPackagesService({
        quantity: +qty,
        package: +dataPackRow?.id,
        order_item: objWithId?.order_item
      });
      dispatch(actions.createOrderItemPackagesSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Create Order Item Package Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      setProductDeleted(null);
      !isMaxQtyReached && setItemNotEnough(newObj?.id);
      setDataTable([...dataTable, newObj]);
      const dataOrder = await services.getOrderDetailServer(+params?.id);
      dispatch(actions.setOrderDetail(dataOrder));
    } catch (error: any) {
      dispatch(actions.createOrderItemPackagesFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const handleSbEdit = async (
    qty: number,
    itemActive: number | undefined | null,
    product: ProductPackageSelect
  ) => {
    const updatedItems = dataTable?.map((item: OrderItemPackages) =>
      item?.id === itemActive
        ? {
            ...item,
            quantity: +qty,
            retailer_purchase_order_item: {
              product_alias: {
                sku: product?.label,
                sku_quantity: item?.retailer_purchase_order_item?.product_alias?.sku_quantity
              }
            }
          }
        : item
    );
    try {
      dispatch(actions.updateOrderItemPackagesRequest());
      await services.updateOrderItemPackagesService(
        {
          quantity: +qty
        },
        itemActive as never
      );
      dispatch(actions.updateOrderItemPackagesSuccess());
      dispatchAlert(
        openAlertMessage({
          message: 'Update Order Item Package Successfully',
          color: 'success',
          title: 'Success'
        })
      );
      setDataTable(updatedItems);
      !isMaxQtyReached && setItemNotEnough(itemActive);
      setValue('qty', 0);
      setValue('product', '');
      setItemActive(null);
      const dataOrder = await services.getOrderDetailServer(+params?.id);
      dispatch(actions.setOrderDetail(dataOrder));
    } catch (error: any) {
      dispatch(actions.updateOrderItemPackagesFailure(error));
      dispatchAlert(
        openAlertMessage({
          message: error?.message,
          color: 'error',
          title: 'Fail'
        })
      );
    }
  };

  const closeModal = () => {
    handleCloseModalEditPack();
    clearErrors();
    setDataTable(dataPackRow?.order_item_packages);
    setItemActive(null);
    setItemChange(null);
    setProductDeleted(null);
    setValue('product', '');
    setDataProducts([]);
  };

  const renderBodyTable = useMemo(() => {
    return dataTable?.map((row: OrderItemPackages) => ({
      id: row?.id,
      product: row?.retailer_purchase_order_item?.product_alias?.sku || '-',
      qty: row.quantity || '-',
      action: (
        <div className="flex items-center justify-center">
          <Button onClick={() => handleEditPack(row, row.id)} startIcon={<PenIcon />}>
            {''}
          </Button>
          <Button onClick={() => handleDeletePack(row.id)} startIcon={<DeleteIcon />}>
            {''}
          </Button>
        </div>
      )
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTable]);

  useEffect(() => {
    if (isEmptyObject(dataPackRow)) {
      setDataTable([]);
    } else {
      setDataTable(dataPackRow?.order_item_packages);
    }
  }, [dataPackRow]);

  useEffect(() => {
    if (dataTable?.length > 0) {
      const itemQty = dataTable?.find((item: OrderItemPackages) => item?.id === product?.value);
      setItemChange(itemQty);
      setValue('qty', itemQty?.quantity);
      setItemActive(itemQty?.id);
    }
  }, [dataTable, product?.value, setValue]);

  useEffect(() => {
    const productDeleted = [] as OrderItemPackages[];
    dataDefaultProductPackRow?.forEach((defaultProduct: OrderItemPackages) => {
      if (
        !dataTable?.some((data: OrderItemPackages) => data?.id === defaultProduct?.id) &&
        totalDefaultBox < dataPackRow?.box_max_quantity
      ) {
        productDeleted?.push(defaultProduct);
        setDataProducts(productDeleted);
      }
    });
  }, [dataDefaultProductPackRow, dataPackRow, dataTable, totalDefaultBox]);

  useEffect(() => {
    const productNotEnough = [] as OrderItemPackages[];
    if (!isMaxQtyReached && itemNotEnough) {
      const newDataNotEnough = dataDefaultProductPackRow?.find(
        (data: OrderItemPackages) => data?.id === itemNotEnough
      ) as never;
      if (newDataNotEnough) {
        productNotEnough?.push(newDataNotEnough);
        setDataProducts(productNotEnough);
        setItemPackageDeleted((prevChangedStates) => [...prevChangedStates, newDataNotEnough]);
        setProductDeleted(newDataNotEnough);
      }
    }
  }, [dataDefaultProductPackRow, isMaxQtyReached, itemNotEnough]);

  useEffect(() => {
    if (filteredArraySame?.length > 0 && totalDefaultBox < dataPackRow?.box_max_quantity) {
      const itemQty = filteredArraySame?.find(
        (item: OrderItemPackages) => item?.id === product?.value
      );
      setDataProducts(filteredArraySame);
      setItemChange(itemQty);
    }
  }, [dataPackRow, filteredArraySame, product, totalDefaultBox]);

  useEffect(() => {
    if (totalDefaultBox === dataPackRow?.box_max_quantity) {
      setDataProducts([]);
    }
  }, [dataPackRow?.box_max_quantity, totalDefaultBox]);

  return (
    <Modal open={openModalEditPack} title={`Box ${dataPackRow?.box?.name}`} onClose={closeModal}>
      <form className="mb-[24px] flex flex-col gap-4">
        <div>
          <Controller
            control={control}
            name="product"
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={
                  dataProducts?.map((item: OrderItemPackages) => ({
                    value: item?.id,
                    label: item?.retailer_purchase_order_item?.product_alias?.sku
                  })) || []
                }
                disabled={
                  dataProducts?.length === 0 &&
                  dataDefaultProductPackRow?.length === dataTable?.length
                }
                handleChangeText={handleSearch}
                required
                addNew={false}
                label="Product"
                name="product"
                placeholder="Select product"
                error={errors.product?.message}
              />
            )}
          />
        </div>
        <div>
          <Controller
            control={control}
            name="qty"
            render={({ field }) => (
              <Input
                {...field}
                disabled={
                  !itemActive &&
                  dataDefaultProductPackRow?.length === dataTable?.length &&
                  dataProducts?.length === 0
                }
                label="Quantity"
                type="number"
                required
                name="qty"
                placeholder="0"
                error={errors.qty?.message}
              />
            )}
          />
        </div>
        <div className="flex justify-end">
          {typeof itemActive === 'number' ? (
            <>
              <Button
                className="mr-4"
                onClick={handleCancelEdit}
                disabled={isEmptyObject(product)}
                color="bg-gey100 dark:bg-gunmetal"
              >
                Cancel
              </Button>
              <Button
                type="button"
                isLoading={isLoadingItemPackages}
                onClick={() => handleSbEdit(qty, itemActive, product)}
                disabled={
                  isEmptyObject(product) ||
                  !isEmptyObject(errors) ||
                  isMaxQtyReached ||
                  isQtyEqualToQuantity ||
                  isLoadingItemPackages
                }
                color="bg-primary500"
              >
                Update {`${product?.label || ''}`}
              </Button>
            </>
          ) : (
            <Button
              startIcon={<IconPlus />}
              type="button"
              isLoading={isLoadingItemPackages}
              onClick={() => handleAddProduct(qty, product)}
              disabled={
                isEmptyObject(product) ||
                !isEmptyObject(errors) ||
                isMaxQtyReached ||
                isQtyEqualToQuantity ||
                isLoadingItemPackages
              }
              color="bg-primary500"
            >
              Add
            </Button>
          )}
        </div>
      </form>
      <Table
        itemActive={itemActive}
        columns={headerTableEditPack}
        loading={false}
        rows={renderBodyTable as never}
        isPagination={false}
        onPageChange={onPageChange}
      />
    </Modal>
  );
}
