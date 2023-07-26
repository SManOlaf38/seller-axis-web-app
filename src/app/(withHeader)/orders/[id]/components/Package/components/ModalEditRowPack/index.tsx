import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useEffect, useMemo, useState } from 'react';

import IconPlus from 'public/plus-icon.svg';
import DeleteIcon from 'public/delete.svg';
import PenIcon from '/public/pencil.svg';

import Autocomplete from '@/components/ui/Autocomplete';
import { Input } from '@/components/ui/Input';
import { Table } from '@/components/ui/Table';
import usePagination from '@/hooks/usePagination';
import { Modal } from '@/components/ui/Modal';
import useSearch from '@/hooks/useSearch';
import { Button } from '@/components/ui/Button';
import { isEmptyObject } from '@/utils/utils';

import { ProductPackage, ProductPackageSelect, headerTableEditPack } from '../../constants';

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
  dataPackRow: any;
  handleCloseModalEditPack: () => void;
};

export default function ModalEditRowPack({
  openModalEditPack,
  dataPackRow,
  handleCloseModalEditPack
}: RowPack) {
  const { debouncedSearchTerm, handleSearch } = useSearch();
  const { page, rowsPerPage, onPageChange } = usePagination();

  const dataDefaultProductPackRow = useMemo(() => {
    return dataPackRow?.products;
  }, [dataPackRow]);

  const [dataTable, setDataTable] = useState<any>([]);
  const [itemActive, setItemActive] = useState<number | undefined | null>();
  const [itemChange, setItemChange] = useState<any>();
  const [dataProducts, setDataProducts] = useState<ProductPackage[]>([]);

  const compareArrays = useMemo(() => {
    if (dataPackRow?.products?.length !== dataTable?.length) {
      return false;
    }
    for (let i = 0; i < dataPackRow?.products?.length; i++) {
      const itemDataPackRow = dataPackRow?.products[i];
      const itemDataTable = dataTable[i];
      if (
        itemDataPackRow?.id_product !== itemDataTable?.id_product ||
        itemDataPackRow?.item !== itemDataTable?.item ||
        itemDataPackRow?.qty !== itemDataTable?.qty
      ) {
        return false;
      }
    }
    return true;
  }, [dataPackRow?.products, dataTable]);

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
    if (itemChange?.qty === +qty) {
      return true;
    }
    return false;
  }, [itemChange?.qty, qty]);

  const totalQtyExcludingCurrent = useMemo(() => {
    return dataTable?.reduce(
      (acc: number, item: ProductPackage) =>
        item?.id_product !== product?.value ? acc + item?.qty : acc,
      0
    );
  }, [dataTable, product?.value]);

  const newTotalQty = useMemo(() => {
    return totalQtyExcludingCurrent + +qty;
  }, [qty, totalQtyExcludingCurrent]);

  const isMaxQtyReached = useMemo(() => {
    return newTotalQty > dataPackRow?.max_qty;
  }, [dataPackRow?.max_qty, newTotalQty]);

  const handleEditPack = (item: ProductPackage, index: number) => {
    setValue('qty', item?.qty);
    setValue('product', { value: item.id_product, label: item?.item });
    setItemChange(item);

    setItemActive(index);
  };

  const handleCancelEdit = () => {
    setValue('qty', 0);
    setValue('product', '');
    setItemActive(null);
    clearErrors();
  };

  const handleDeletePack = (indexItem: number) => {
    const newArray = dataTable?.filter((item: ProductPackage) => item?.id_product !== indexItem);
    setDataTable(newArray);
  };

  const handleAddProduct = (qty: number, product: ProductPackageSelect) => {
    const newObj = {
      id_product: product?.value,
      item: product?.label,
      qty: +qty
    };
    setDataTable([...dataTable, newObj]);
  };

  const handleSbEdit = (
    qty: number,
    itemActive: number | undefined | null,
    product: ProductPackageSelect
  ) => {
    const updatedItems = dataTable?.map((item: any) =>
      item?.id_product === itemActive
        ? {
            ...item,
            item: product?.label,
            qty: +qty
          }
        : item
    );
    setDataTable(updatedItems);
    setValue('qty', 0);
    setValue('product', '');
    setItemActive(null);
  };

  const closeModal = () => {
    handleCloseModalEditPack();
    clearErrors();
    setDataTable(dataPackRow?.products);
    setItemActive(null);
    setItemChange(null);
    setValue('product', '');
    setDataProducts([]);
  };

  const handleSubmitEdit = async () => {};

  const renderBodyTable = useMemo(() => {
    return dataTable?.map((row: any) => ({
      id: row.id_product,
      product: row.item || '-',
      qty: row.qty || '-',
      action: (
        <div className="flex items-center justify-center">
          <Button onClick={() => handleEditPack(row, row.id_product)} startIcon={<PenIcon />}>
            {''}
          </Button>
          <Button onClick={() => handleDeletePack(row.id_product)} startIcon={<DeleteIcon />}>
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
      setDataTable(dataPackRow?.products);
    }
  }, [dataPackRow]);

  useEffect(() => {
    if (dataTable?.length > 0) {
      const itemQty = dataTable?.find(
        (item: ProductPackage) => item?.id_product === product?.value
      );
      setItemChange(itemQty);
      setValue('qty', itemQty?.qty);
      setItemActive(itemQty?.id_product);
    }
  }, [dataTable, product?.value, setValue]);

  useEffect(() => {
    const productDeleted = [] as ProductPackage[];
    dataDefaultProductPackRow?.forEach((defaultProduct: ProductPackage) => {
      if (
        !dataTable?.some((data: ProductPackage) => data?.id_product === defaultProduct?.id_product)
      ) {
        productDeleted?.push(defaultProduct);
      }
    });
    setDataProducts(productDeleted);
  }, [dataDefaultProductPackRow, dataTable]);

  return (
    <Modal open={openModalEditPack} title={`Box ${dataPackRow?.box_name}`} onClose={closeModal}>
      <form className="mb-[24px] flex flex-col gap-4">
        <div>
          <Controller
            control={control}
            name="product"
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={
                  dataProducts?.map((item: ProductPackage) => ({
                    value: item.id_product,
                    label: item.item
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
                pathRedirect="/products/create"
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
                disabled={!itemActive && dataDefaultProductPackRow?.length === dataTable?.length}
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
                onClick={() => handleSbEdit(qty, itemActive, product)}
                disabled={
                  isEmptyObject(product) ||
                  !isEmptyObject(errors) ||
                  isMaxQtyReached ||
                  isQtyEqualToQuantity
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
              onClick={() => handleAddProduct(qty, product)}
              disabled={
                isEmptyObject(product) ||
                !isEmptyObject(errors) ||
                isMaxQtyReached ||
                isQtyEqualToQuantity
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
      <div className="flex justify-end pt-4">
        <Button disabled={compareArrays} color="bg-primary500" onClick={handleSubmitEdit}>
          Update Box {`${dataPackRow?.box_name}`}
        </Button>
      </div>
    </Modal>
  );
}
